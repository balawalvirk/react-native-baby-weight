import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import Tts from 'react-native-tts';
import I18n from 'react-native-i18n';
import FLContainer from 'components/core/FLContainer';
import FLText from 'components/core/FLText';
import FLFancyButton from 'components/external/FLFancyButton';
import MWModeButton from 'components/myweigh/MWModeButton';
import MWScaleButton from 'components/myweigh/MWScaleButton';
import CONSTANTS from 'config/constants';
import TIMEOUTS from 'config/timeouts';
import {BluetoothContext} from 'context';
import manager from 'utils/BleManager';
import {connectToDevice, scanDevice} from 'utils/ScanAndConnect';
import retrieveUserData from 'utils/getUserData';
import toast from 'utils/toast';
import {usePrevious} from 'react-use';
import {useDebouncedCallback} from 'use-debounce';
import {convertWeightValues} from 'utils/convertWeightValues';
import styles from './styles';

const Weigh = ({navigation}) => {
  const {navigate} = useNavigation();
  const [weight, setWeight] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [goal, setGoal] = useState('');
  const [displayWeight, setDisplayWeight] = useState('');
  const [isWeightStatic, setIsWeightStatic] = useState(false);
  const [audioWeight, setAudioWeight] = useState('');
  const [isSwitchingUnit, setIsSwitchingUnit] = useState(false);
  const isMountedRef = useRef(true);
  // Use refs to store latest weight data without causing re-renders
  const latestWeightDataRef = useRef(null);
  const lastUnitSwitchRef = useRef(0);
  const isConnectingRef = useRef(false);
  const disconnectSubRef = useRef(null);
  const monitorSubRef = useRef(null);
  const keepaliveRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const updateTimerRef = useRef(null);
  const userInitiatedUnitChangeRef = useRef(false); // Track if user clicked unit button
  const lastSpokenRef = useRef(''); // Track last spoken phrase to prevent stale reads

  const {
    store: {
      bluetoothDevice: [bluetoothDevice, setBluetoothDevice],
      bluetoothDeviceId: [bluetoothDeviceId, setBluetoothDeviceId],
      states: [states],
      isConnected: [isConnected, setIsConnected],
      isWeightHold: [isWeightHold, setIsWeightHold],
      connectionStatus: [connectionStatus, setConnectionStatus],
    },
  } = useContext(BluetoothContext);

  const {audioOuncesLocale, audioWeightLocale, ounces, unit, pounds, weightDetected} = states;
  const {weightText2, weightText} = styles;
  const kgSelected = selectedUnit === CONSTANTS.SCALE_UNITS.KILO;
  const lbSelected = selectedUnit === CONSTANTS.SCALE_UNITS.POUND;
  const lbozSelected = selectedUnit === CONSTANTS.SCALE_UNITS.POUND_OUNCE;
  const prevWeight = usePrevious(displayWeight);

  // --- helper hooks ---
  const onSpeakDebounced = useDebouncedCallback((value) => speak(value), TIMEOUTS.SET_TIMER);

  useEffect(() => {
    AsyncStorage.getItem(CONSTANTS.SETTINGS.AUTO_SPEAK_KEY).then((v) => {
      if (v !== null) setAutoSpeak(JSON.parse(v));
    });
  }, []);

  const getGoal = async () => {
    const goals = await AsyncStorage.getItem(CONSTANTS.SETTINGS.GOAL_KEY);
    setGoal(goals);
  };

  // --------- CLEANUP FUNCTIONS ---------
  const clearAllBleSideEffects = useCallback(() => {
    console.log('🧹 Clearing all BLE side effects');

    if (disconnectSubRef.current) {
      try {
        disconnectSubRef.current.remove();
      } catch {}
      disconnectSubRef.current = null;
    }
    if (monitorSubRef.current) {
      try {
        monitorSubRef.current.remove();
      } catch {}
      monitorSubRef.current = null;
    }
    if (keepaliveRef.current) {
      clearInterval(keepaliveRef.current);
      keepaliveRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current);
      updateTimerRef.current = null;
    }
  }, []);

  const disconnectAndCleanup = useCallback(async () => {
    console.log('🔌 Disconnecting and cleaning up');

    isMountedRef.current = false;
    isConnectingRef.current = false;

    // Clear all timers and subscriptions
    clearAllBleSideEffects();

    // Disconnect from device
    if (bluetoothDeviceId) {
      try {
        await manager.cancelDeviceConnection(bluetoothDeviceId);
        console.log('✓ Device disconnected');
      } catch (e) {
        console.log('Disconnect error (might already be disconnected):', e.message);
      }
    }

    // Reset all state
    setIsConnected(false);
    setBluetoothDevice(null);
    setWeight(null);
    setDisplayWeight('');
    setAudioWeight('');
    setIsWeightStatic(false);
    setIsSwitchingUnit(false);
    latestWeightDataRef.current = null;

    setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.DISCONNECTED));
  }, [bluetoothDeviceId, clearAllBleSideEffects, setBluetoothDevice]);

  // --------- UNMOUNT CLEANUP ---------
  useEffect(() => {
    isMountedRef.current = true;
    console.log('📱 Weigh screen mounted');

    return () => {
      console.log('📱 Weigh screen unmounting - cleaning up');
      disconnectAndCleanup();
    };
  }, [disconnectAndCleanup]);

  // --------- RESET ON SCREEN FOCUS (when coming back) ---------
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('👁️ Screen focused - resetting');

      // Reset all refs and state
      isMountedRef.current = true;
      isConnectingRef.current = false;
      latestWeightDataRef.current = null;
      reconnectAttemptsRef.current = 0;

      setWeight(null);
      setDisplayWeight('');
      setAudioWeight('');
      setIsWeightStatic(false);
      setIsSwitchingUnit(false);

      // If we have a device ID, reconnect
      if (bluetoothDeviceId && !isConnected) {
        console.log('Reconnecting on screen focus...');
        connect();
      }
    });

    return unsubscribe;
  }, [navigation, bluetoothDeviceId, isConnected, connect]);

  // --------- SCREEN BLUR (when leaving screen) ---------
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('👁️ Screen blurred - pausing connections');
      isMountedRef.current = false;

      // Optional: Stop keepalive when screen is not visible
      if (keepaliveRef.current) {
        clearInterval(keepaliveRef.current);
        keepaliveRef.current = null;
      }
    });

    return unsubscribe;
  }, [navigation]);
  // Format weight display based on current data
  const formatWeightDisplay = useCallback((weightData) => {
    if (!weightData || !weightData.unit || weightData.weightDetected === undefined) {
      return {display: '', audio: ''};
    }

    let formattedWeight = '';
    let formattedAudio = '';

    switch (weightData.unit) {
      case CONSTANTS.SCALE_UNITS.KILO:
        formattedWeight = `${weightData.weightDetected} kg`;
        formattedAudio = `${weightData.audioWeightLocale} kilograms`;
        break;
      case CONSTANTS.SCALE_UNITS.POUND:
        formattedWeight = `${weightData.weightDetected} lb`;
        formattedAudio = `${weightData.audioWeightLocale} pounds`;
        break;
      case CONSTANTS.SCALE_UNITS.POUND_OUNCE:
        formattedWeight = `${weightData.pounds} lb ${weightData.ounces} oz`;
        formattedAudio = `${weightData.pounds} pounds ${weightData.audioOuncesLocale} ounces`;
        break;
      default:
        return {display: '', audio: ''};
    }

    return {display: formattedWeight, audio: formattedAudio};
  }, []);

  // Update UI with latest weight data
  const updateDisplayFromRef = useCallback(() => {
    if (!latestWeightDataRef.current) return;

    const weightData = latestWeightDataRef.current;
    const {display, audio} = formatWeightDisplay(weightData);

    if (display) {
      console.log(`Updating UI - Unit: ${weightData.unit}, Display: ${display}`);
      setDisplayWeight(display);
      setAudioWeight(audio);

      // Speak the latest value immediately, avoiding stale audio
      if (autoSpeak && audio && audio !== lastSpokenRef.current) {
        speak(audio);
        lastSpokenRef.current = audio;
      }

      // Sync unit selection with device
      if (selectedUnit !== weightData.unit) {
        console.log(`Unit changed from device: ${selectedUnit} -> ${weightData.unit}`);
        setSelectedUnit(weightData.unit);
        setIsSwitchingUnit(false);

        // If user initiated the change, pause/hold the weight
        if (userInitiatedUnitChangeRef.current) {
          console.log('User initiated unit change - pausing weight');
          userInitiatedUnitChangeRef.current = false;

          // Auto-pause when user changes unit
          if (!isWeightHold) {
            setTimeout(() => {
              handleToggleHoldWeight();
            }, 100);
          }
        }
      }
    }
  }, [formatWeightDisplay, selectedUnit, isWeightHold]);

  const handleToggleHoldWeight = useCallback(async () => {
    if (!bluetoothDevice) {
      console.log('Cannot toggle hold - no device');
      return;
    }

    console.log('Toggling hold weight. Current state:', isWeightHold);

    try {
      setIsWeightHold((prevState) => !prevState);
      await scaleFunction(CONSTANTS.SCALE_FUNCTIONS.HOLD);
      console.log('✓ Hold weight toggled');
    } catch (error) {
      console.error('✗ Hold weight failed:', error);
      // Revert state if command failed
      setIsWeightHold((prevState) => !prevState);
    }
  }, [bluetoothDevice, isWeightHold, scaleFunction]);
  const scaleFunction = useCallback(
    async (scaleFunctionCommand) => {
      if (!bluetoothDevice) {
        console.log('scaleFunction: No device available');
        return;
      }

      console.log('Sending scale function command:', scaleFunctionCommand);

      try {
        await bluetoothDevice.writeCharacteristicWithResponseForService(
          CONSTANTS.SERVICE_UUID,
          CONSTANTS.CHARACTERISTIC_UUID,
          scaleFunctionCommand,
        );
        console.log('✓ Scale function sent successfully');
      } catch (error) {
        console.error('✗ Scale function failed:', error);
        throw error;
      }
    },
    [bluetoothDevice],
  );

  const handleManualDisconnect = useCallback(() => {
    console.log('Manual disconnect button pressed');
    disconnectAndCleanup();
  }, [disconnectAndCleanup]);

  const connect = useCallback(async () => {
    if (!isMountedRef.current) {
      console.log('Component unmounted, skipping connect');
      return;
    }

    if (isConnectingRef.current || isConnected || !bluetoothDeviceId) return;

    isConnectingRef.current = true;
    setConnectionStatus('Connecting...');
    console.log('Connecting to', bluetoothDeviceId);

    try {
      // clean up before reconnecting
      if (monitorSubRef.current) {
        try {
          monitorSubRef.current.remove();
        } catch {}
        monitorSubRef.current = null;
      }
      if (disconnectSubRef.current) {
        try {
          disconnectSubRef.current.remove();
        } catch {}
        disconnectSubRef.current = null;
      }
      if (keepaliveRef.current) {
        clearInterval(keepaliveRef.current);
        keepaliveRef.current = null;
      }

      // ensure previous connection is closed cleanly
      try {
        await manager.cancelDeviceConnection(bluetoothDeviceId);
      } catch {}

      const result = await connectToDevice(bluetoothDeviceId);
      if (!result?.device) throw new Error('Connection failed');
      const device = result.device;

      await device.discoverAllServicesAndCharacteristics();
      console.log('Connected successfully:', bluetoothDeviceId);

      // Store the device in context
      setBluetoothDevice(device);
      console.log('Device stored in context');

      disconnectSubRef.current = manager.onDeviceDisconnected(bluetoothDeviceId, (error, dev) => {
        console.log('⚠️ Disconnected event:', error?.message, dev?.id);

        if (isConnectingRef.current || !isMountedRef.current) {
          console.log('Ignoring disconnect - connecting or unmounted');
          return;
        }

        setIsConnected(false);
        setBluetoothDevice(null);
        setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.RECONNECTING));

        if (bluetoothDeviceId && isMountedRef.current) {
          console.log('Scheduling reconnect in 2 seconds...');

          if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
          }

          reconnectTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              console.log('Attempting reconnect...');
              reconnectTimerRef.current = null;
              isConnectingRef.current = false;
              connect();
            }
          }, 2000);
        }
      });

      console.log('Starting monitor after discovery…');
      monitorSubRef.current = device.monitorCharacteristicForService(
        CONSTANTS.SERVICE_UUID,
        CONSTANTS.CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (!isMountedRef.current) return;

          if (error) {
            console.error('Monitor error:', error?.message);
            const msg = error?.message || '';

            if (msg.includes('disconnected') || msg.includes('cancelled')) {
              console.log('Monitor stopped - device disconnected');
              return;
            }

            setConnectionStatus(msg);
            return;
          }

          const vals = convertWeightValues(characteristic?.value ?? '');
          latestWeightDataRef.current = vals;

          if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
          updateTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              updateDisplayFromRef();
            }
          }, 100);

          setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.CONNECTED));
        },
      );

      keepaliveRef.current = setInterval(async () => {
        if (isMountedRef.current) {
          try {
            await manager.readRSSIForDevice(bluetoothDeviceId);
            console.log('📡 Keepalive ping ok');
          } catch (e) {
            console.log('Keepalive ping failed:', e.message);
          }
        }
      }, 45000);

      setIsConnected(true);
      setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.CONNECTED));
    } catch (error) {
      console.error('Connection failed:', error);
      setIsConnected(false);
      setBluetoothDevice(null);
      setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.DISCONNECTED));
    } finally {
      isConnectingRef.current = false;
    }
  }, [bluetoothDeviceId, isConnected, updateDisplayFromRef, setBluetoothDevice]);

  // trigger connect when we have an id
  useEffect(() => {
    if (bluetoothDeviceId && !isConnected && !isConnectingRef.current) connect();
  }, [bluetoothDeviceId, isConnected, connect]);

  // first boot: scan if no device id
  useEffect(() => {
    getGoal();
    if (!bluetoothDeviceId) {
      (async () => {
        try {
          await requestMultiple([
            PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
            PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ]);
          setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.SCANNING));
          const data = await scanDevice();
          if (data?.id) {
            setConnectionStatus(data.status || 'Connecting...');
            setBluetoothDeviceId(data.id);
          } else {
            setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.DISCONNECTED));
          }
        } catch (e) {
          console.error('Permission/scan error:', e);
          setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.ENABLE_PERMISSION));
        }
      })();
    }
    return () => clearAllBleSideEffects();
  }, [bluetoothDeviceId, setBluetoothDeviceId, clearAllBleSideEffects]);

  // FIX: Update manual reconnect to clear the connecting flag
  const reconnect = useCallback(() => {
    console.log('🔄 Manual reconnect requested');
    reconnectAttemptsRef.current = 0;
    isConnectingRef.current = false; // Reset flag

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    if (!isConnected && bluetoothDeviceId) {
      connect();
    }
  }, [bluetoothDeviceId, isConnected, connect]);

  useEffect(() => {
    // Remove debounced speaking to avoid reading previous value
    if (displayWeight === prevWeight) {
      setIsWeightStatic(true);
    } else {
      setWeight(displayWeight);
      setIsWeightStatic(false);
    }
  }, [autoSpeak, displayWeight, prevWeight]);

  const speak = useCallback(
    (text) => {
      Tts.getInitStatus().then(
        () => {
          if (text) {
            Tts.stop();
            Tts.speak(text);
            if (!isWeightHold && bluetoothDevice) {
              handleToggleHoldWeight();
            }
          }
        },
        (err) => {
          if (err.code === 'no_engine') Tts.requestInstallEngine();
        },
      );
    },
    [isWeightHold, bluetoothDevice, handleToggleHoldWeight],
  );
  const handleToggleTareToZero = useCallback(async () => {
    if (!bluetoothDevice) {
      console.log('Cannot tare - no device');
      return;
    }

    if (isWeightStatic) {
      console.log('Taring to zero...');
      try {
        await handleToggleHoldWeight();
        await scaleFunction(CONSTANTS.SCALE_FUNCTIONS.TARE);
        setIsWeightStatic(false);
        console.log('✓ Tare complete');
      } catch (error) {
        console.error('✗ Tare failed:', error);
      }
    }
  }, [bluetoothDevice, isWeightStatic, handleToggleHoldWeight, scaleFunction]);

  const handleToggleAutoSpeaking = useCallback(async () => {
    const newValue = !autoSpeak;
    setAutoSpeak(newValue);
    await AsyncStorage.setItem(CONSTANTS.SETTINGS.AUTO_SPEAK_KEY, JSON.stringify(newValue));
  }, [autoSpeak]);

  const convertWeight = useCallback(() => {
    if (!latestWeightDataRef.current) return 0;

    const weightData = latestWeightDataRef.current;

    switch (weightData.unit) {
      case CONSTANTS.SCALE_UNITS.KILO:
        return Number.parseInt(parseFloat(weightData.weightDetected) * CONSTANTS.CONVERSIONS.GRAMS_KILO, 10);
      case CONSTANTS.SCALE_UNITS.POUND:
        return Number.parseInt(parseFloat(weightData.weightDetected) * CONSTANTS.CONVERSIONS.GRAMS_POUND, 10);
      case CONSTANTS.SCALE_UNITS.POUND_OUNCE:
        return Number.parseInt(
          parseFloat(weightData.pounds) * CONSTANTS.CONVERSIONS.GRAMS_POUND +
            parseFloat(weightData.ounces) * CONSTANTS.CONVERSIONS.GRAMS_OUNCE,
          10,
        );
      default:
        return 0;
    }
  }, []);

  // OPTIONAL: Add a manual disconnect function for testing
  const disconnect = useCallback(async () => {
    console.log('Manual disconnect requested');
    clearAllBleSideEffects();

    if (bluetoothDeviceId) {
      try {
        await manager.cancelDeviceConnection(bluetoothDeviceId);
      } catch (e) {
        console.log('Disconnect error:', e);
      }
    }

    setIsConnected(false);
    setBluetoothDevice(null);
    setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.DISCONNECTED));
  }, [bluetoothDeviceId, clearAllBleSideEffects, setBluetoothDevice]);
  const confirmSave = useCallback(async () => {
    if (weight !== CONSTANTS.DISCONNECTED_MESSAGE && weight) {
      const weightGrams = convertWeight();
      if (goal && weightGrams > goal) {
        const user = await retrieveUserData();
        toast(I18n.t(CONSTANTS.SCREEN_WEIGH_MESSAGES.CONGRATULATIONS, user.name));
      }
      navigate(CONSTANTS.SCREEN_SAVE, {
        [CONSTANTS.SCREEN_SAVE_PARAM_WEIGHT]: weightGrams,
        selectedUnit,
      });
    }
  }, [weight, convertWeight, goal, navigate, selectedUnit]);

  // Add: cycle to a desired unit (optimistic selection, BLE write)
  const cycleUnitTo = useCallback(
    async (desiredUnit) => {
      const now = Date.now();
      if (now - lastUnitSwitchRef.current < 300) {
        return;
      }
      lastUnitSwitchRef.current = now;
      // Optimistically update selected unit for snappy UI
      if (desiredUnit !== selectedUnit) {
        setSelectedUnit(desiredUnit);
      }
      console.log({desiredUnit});

      if (bluetoothDevice && isConnected) {
        try {
          setIsSwitchingUnit(true);
          // userInitiatedUnitChangeRef.current = true;
          await bluetoothDevice.writeCharacteristicWithResponseForService(
            CONSTANTS.SERVICE_UUID,
            CONSTANTS.CHARACTERISTIC_UUID,
            CONSTANTS.SCALE_FUNCTIONS.UNIT,
          );
        } catch (e) {
          console.error('Unit switch write failed:', e);
        } finally {
          // Ensure we always clear the switching flag
          setIsSwitchingUnit(false);
        }
      }
    },
    [bluetoothDevice, isConnected, selectedUnit],
  );

  const cycleUnit = useCallback(async () => {
    const now = Date.now();
    if (now - lastUnitSwitchRef.current < 500) {
      console.log('Unit switch debounced');
      return;
    }

    if (isSwitchingUnit) {
      console.log('Already switching unit, please wait');
      return;
    }

    if (!bluetoothDevice) {
      console.log('Cannot cycle unit - bluetoothDevice is null');
      return;
    }

    lastUnitSwitchRef.current = now;
    console.log('Cycling unit with device:', bluetoothDevice.id);

    try {
      setIsSwitchingUnit(true);
      userInitiatedUnitChangeRef.current = true;

      await bluetoothDevice.writeCharacteristicWithResponseForService(
        CONSTANTS.SERVICE_UUID,
        CONSTANTS.CHARACTERISTIC_UUID,
        CONSTANTS.SCALE_FUNCTIONS.UNIT,
      );

      console.log('✓ Unit cycle command sent successfully');

      setTimeout(() => {
        setIsSwitchingUnit(false);
      }, 1500);
    } catch (e) {
      console.error('✗ Unit cycle failed:', e);
      setIsSwitchingUnit(false);
      userInitiatedUnitChangeRef.current = false;
    }
  }, [bluetoothDevice, isSwitchingUnit]);

  // ------------- UI -------------
  return (
    <FLContainer>
      <FLContainer style={styles.displayPane}>
        <FLText style={styles.errorText}>{connectionStatus}</FLText>
        <FLContainer style={styles.modePane}>
          <MWModeButton title="Kg" onPress={cycleUnit} selected={kgSelected} disabled={isSwitchingUnit} />
          <MWModeButton title="Lb" onPress={cycleUnit} selected={lbSelected} disabled={isSwitchingUnit} />
          <MWModeButton title="Lb:Oz" onPress={cycleUnit} selected={lbozSelected} disabled={isSwitchingUnit} />
        </FLContainer>

        <FLContainer style={styles.weightPane} onPress={() => reconnect()} blink={true}>
          <FLText style={weight ? weightText : weightText2}>
            {weight || I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.DISCONNECT)}
          </FLText>
          {isSwitchingUnit && <FLText style={styles.smallText}></FLText>}
        </FLContainer>
      </FLContainer>
      <FLContainer style={styles.functionPane}>
        <MWScaleButton
          title={I18n.t(CONSTANTS.SCREEN_WEIGH_MESSAGES.TARE)}
          icon="refresh"
          onPress={handleToggleTareToZero}
          disabled={!bluetoothDevice || !isWeightStatic}
        />
        <MWScaleButton
          title={I18n.t(CONSTANTS.SCREEN_WEIGH_MESSAGES.HOLD)}
          icon={isWeightHold ? 'play' : 'pause'}
          onPress={handleToggleHoldWeight}
          disabled={!bluetoothDevice}
        />
        <MWScaleButton
          title={I18n.t(CONSTANTS.SCREEN_WEIGH_MESSAGES.SPEECH)}
          icon={autoSpeak ? 'volume-high' : 'volume-off'}
          onPress={handleToggleAutoSpeaking}
        />
      </FLContainer>
      <FLContainer style={styles.buttonPane}>
        <FLFancyButton title={I18n.t(CONSTANTS.SCREEN_WEIGH_MESSAGES.SAVE)} onPress={() => confirmSave()} />
      </FLContainer>
    </FLContainer>
  );
};

export default Weigh;
