import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import FLContainer from 'components/core/FLContainer';
import FLText from 'components/core/FLText';
import FLFancyButton from 'components/external/FLFancyButton';
import MWModeButton from 'components/myweigh/MWModeButton';
import MWScaleButton from 'components/myweigh/MWScaleButton';
import CONSTANTS from 'config/constants';
import TIMEOUTS from 'config/timeouts';
import {BluetoothContext} from 'context';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import BleManager from 'react-native-ble-manager';
import I18n from 'react-native-i18n';
import {PERMISSIONS, request, requestMultiple} from 'react-native-permissions';
import Tts from 'react-native-tts';
import {usePrevious} from 'react-use';
import {useDebouncedCallback} from 'use-debounce';
import manager from 'utils/BleManager';
import {connectToDevice, scanDevice} from 'utils/ScanAndConnect';
import {checkError} from 'utils/checkBluetoothError';
import retrieveUserData from 'utils/getUserData';
import toast from 'utils/toast';
import styles from './styles';
// import BleManager from '../../utils/BleManager';

const Weigh = () => {
  // const BleManagerModule = NativeModules.BleManager;
  // const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  // const handleDiscoverPeripheral = (peripheral) => {
  //   console.log('Discovered peripheral', JSON.stringify(peripheral, null, 2));
  //   if (peripheral.name === CONSTANTS.DEVICE_NAME) {
  //     setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.CONNECTING));
  //     setBluetoothDeviceId(peripheral.id);
  //   }
  // };

  // bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
  const {navigate} = useNavigation();
  const [weight, setWeight] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isSwitchingUnit, setIsSwitchingUnit] = useState(false);
  const lastUnitSwitchRef = useRef(0);

  useEffect(() => {
    const getAutoSpeak = async () => {
      const value = await AsyncStorage.getItem(CONSTANTS.SETTINGS.AUTO_SPEAK_KEY);
      if (value !== null) {
        setAutoSpeak(JSON.parse(value));
      }
    };
    getAutoSpeak();
  }, []);
  const [isWeightStatic, setIsWeightStatic] = useState(false);
  const [goal, setGoal] = useState('');
  const [displayWeight, setDisplayWeight] = useState('');
  const prevWeight = usePrevious(displayWeight);
  const [audioWeight, setAudioWeight] = useState('');
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

  const onSpeakDebounced = useDebouncedCallback((value) => {
    speak(value);
  }, TIMEOUTS.SET_TIMER);

  const getGoal = async () => {
    const goals = await AsyncStorage.getItem(CONSTANTS.SETTINGS.GOAL_KEY);
    setGoal(goals);
  };
  // Cleanup effect for Bluetooth operations
  useEffect(() => {
    let isComponentMounted = true;

    const cleanup = async () => {
      try {
        if (!isComponentMounted) {
          return;
        }

        // Stop scanning first
        manager.stopDeviceScan();

        // Disconnect from device if connected
        if (bluetoothDevice && isConnected) {
          await bluetoothDevice.cancelConnection();
        }

        // Reset states
        setIsConnected(false);
        setBluetoothDevice(null);
        setBluetoothDeviceId(null);
        setWeight(null);

        // Remove all listeners
        manager.removeAllListeners();
      } catch (e) {
        console.error('Error cleaning up Bluetooth:', e);
      }
    };

    return () => {
      isComponentMounted = false;
      cleanup();
    };
  }, [bluetoothDevice, isConnected, setBluetoothDevice, setBluetoothDeviceId, setIsConnected]);

  // Connection monitoring effect
  useEffect(() => {
    let isComponentMounted = true;
    let reconnectTimeout;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;

    const handleDisconnect = async () => {
      if (!isComponentMounted) {
        return;
      }

      console.log('Device disconnected, attempting to reconnect...');
      setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.RECONNECTING));

      // Clean up existing connection first
      try {
        await manager.cancelDeviceConnection(bluetoothDeviceId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error cleaning up existing connection:', error);
      }

      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        // Wait before trying to reconnect
        reconnectTimeout = setTimeout(async () => {
          try {
            // Stop any ongoing scan before reconnecting
            manager.stopDeviceScan();

            const result = await connectToDevice(bluetoothDeviceId);
            if (result.connection && result.device) {
              setBluetoothDevice(result.device);
              setIsConnected(true);
              setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.CONNECTED));
              reconnectAttempts = 0; // Reset attempts on successful connection

              // Re-initialize device after reconnection
              try {
                await setUnitData();
              } catch (error) {
                console.error('Error reinitializing device after reconnection:', error);
              }
            } else {
              throw new Error('Reconnection failed');
            }
          } catch (error) {
            console.error('Reconnection attempt failed:', error);
            if (reconnectAttempts >= maxReconnectAttempts) {
              setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.DISCONNECTED));
              // Reset states on final failure
              setIsConnected(false);
              setBluetoothDevice(null);
            }
          }
        }, 2000); // Wait 2 seconds before reconnecting
      } else {
        setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.DISCONNECTED));
        // Reset states
        setIsConnected(false);
        setBluetoothDevice(null);
      }
    };

    if (bluetoothDevice && isConnected) {
      const subscription = manager.onDeviceDisconnected(bluetoothDeviceId, handleDisconnect);
      return () => {
        isComponentMounted = false;
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
        }
        subscription.remove();
      };
    }
  }, [bluetoothDevice, bluetoothDeviceId, isConnected, setUnitData]);

  const [isScanning, setIsScanning] = useState(false);

  // Goal and initial connection effect
  useEffect(() => {
    getGoal();

    if (!bluetoothDeviceId) {
      setWeight(null);
      requestLocationPermission();
    }
  }, [bluetoothDeviceId]);

  // Connection effect
  useEffect(() => {
    let isActive = true;

    if (bluetoothDeviceId && !isConnected && isActive) {
      connect();
    }

    return () => {
      isActive = false;
    };
  }, [bluetoothDeviceId, isConnected]);

  // Value update effect
  useEffect(() => {
    if (isConnected) {
      updateValue();
    }
  }, [isConnected, unit, weightDetected, pounds, ounces, audioWeightLocale, audioOuncesLocale, updateValue]);

  // Bluetooth state change effect
  useEffect(() => {
    let isComponentMounted = true;
    let stateSubscription;

    if (manager) {
      stateSubscription = manager.onStateChange((state) => {
        if (!isComponentMounted) {
          return;
        }

        if (state === 'PoweredOn') {
          requestLocationPermission();
        } else if (state === 'PoweredOff') {
          // Clean up connection when Bluetooth is turned off
          setIsConnected(false);
          setBluetoothDevice(null);
          setBluetoothDeviceId(null);
          setWeight(null);
        }
      }, true);
    }

    return () => {
      isComponentMounted = false;
      if (stateSubscription) {
        stateSubscription.remove();
      }
    };
  }, [manager, requestLocationPermission, setBluetoothDevice, setBluetoothDeviceId, setIsConnected]);

  useEffect(() => {
    if (prevWeight !== displayWeight && autoSpeak) {
      onSpeakDebounced(audioWeight);
    }
    if (displayWeight === prevWeight) {
      setIsWeightStatic(true);
    } else {
      setWeight(displayWeight);
      setIsWeightStatic(false);
    }
  }, [audioWeight, autoSpeak, displayWeight, onSpeakDebounced, prevWeight]);

  const handleGetConnectedDevices = () => {
    const peripherals = new Map();
    BleManager.getConnectedPeripherals([]).then((results) => {
      console.log({results});
      if (false) {
        console.log('No connected bluetooth devices');
      } else {
        for (let i = 0; i < results.length; i++) {
          const peripheral = results[i];
          peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          console.log({peripheral});
          // setConnectedDevices(Array.from(peripherals.values()));
        }
      }
    });
  };
  const scan = async () => {
    setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.SCANNING));

    scanDevice()
      .then((data) => {
        console.log('Scan results', data);
        setConnectionStatus(data.status);
        setBluetoothDeviceId(data.id);
      })
      .catch((error) => {
        console.log(error, 'hahahh');
        error.errorCode === CONSTANTS.BLE_ERROR_CODE_NAMES.BLUETOOTH_UNAUTHORIZED
          ? requestLocationPermission()
          : setConnectionStatus(
              error?.message !== 'Bluetooth already in discovery mode' ? error?.message || '' : 'Connecting...',
            );
      });
  };

  const connect = async () => {
    try {
      setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.CONNECTING));
      const result = await connectToDevice(bluetoothDeviceId);

      if (result.error) {
        setConnectionStatus(checkError({message: result.error}));
        return;
      }

      if (result.connection && result.device) {
        setBluetoothDevice(result.device);
        setIsConnected(true);
        setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.CONNECTED));
        await setUnitData();
      } else {
        setIsConnected(false);
        setBluetoothDevice(null);
        setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.DISCONNECTED));
      }
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus(checkError(error));
      setIsConnected(false);
      setBluetoothDevice(null);
    }
  };
  const requestPermissionWithRationale = (permission, rationale) => {
    return new Promise((resolve, reject) => {
      request(permission, rationale)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  };

  const requestLocationPermission = async () => {
    requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ])
      .then((res) => {
        scan();
      })
      .catch((e) => {
        setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.ENABLE_PERMISSION));
        setConnectionStatus(error);
      });
  };

  const setUnitData = async () => {
    const user = await retrieveUserData();
    cycleUnitTo(user?.selectedUnit || '');
  };

  const updateValue = useCallback(() => {
    switch (unit) {
      case CONSTANTS.SCALE_UNITS.KILO:
        setDisplayWeight(I18n.t('DISPLAY.KILO', {weightDetected}));
        setAudioWeight(I18n.t('AUDIO.KILO', {audioWeightLocale}));
        break;
      case CONSTANTS.SCALE_UNITS.POUND:
        setDisplayWeight(I18n.t('DISPLAY.POUND', {weightDetected}));
        setAudioWeight(I18n.t('AUDIO.POUND', {audioWeightLocale}));
        break;
      case CONSTANTS.SCALE_UNITS.POUND_OUNCE:
        setDisplayWeight(I18n.t('DISPLAY.OUNCE', {pounds, ounces}));
        setAudioWeight(I18n.t('AUDIO.OUNCE', {pounds, audioOuncesLocale}));
        break;
    }
    setSelectedUnit(unit);
  }, [unit, weightDetected, audioWeightLocale, pounds, ounces, audioOuncesLocale]);

  const speak = useCallback(
    (speechText) => {
      Tts.getInitStatus().then(
        () => {
          if (audioWeight) {
            Tts.speak(speechText);
            if (!isWeightHold) {
              handleToggleHoldWeight();
            }
          }
        },
        (error) => {
          if (error.code === 'no_engine') {
            Tts.requestInstallEngine();
          }
        },
      );
    },
    [audioWeight, isWeightHold, handleToggleHoldWeight],
  );

  const reconnect = useCallback(() => {
    requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ])
      .then(() => {
        scan();
      })
      .catch((err) => {
        console.error('Reconnect error:', err);
      });
  }, [scan]);

  const convertWeight = useCallback(() => {
    switch (unit) {
      case CONSTANTS.SCALE_UNITS.KILO:
        return Number.parseInt(parseFloat(weightDetected) * CONSTANTS.CONVERSIONS.GRAMS_KILO, 10);

      case CONSTANTS.SCALE_UNITS.POUND:
        return Number.parseInt(parseFloat(weightDetected) * CONSTANTS.CONVERSIONS.GRAMS_POUND, 10);

      case CONSTANTS.SCALE_UNITS.POUND_OUNCE:
        return Number.parseInt(
          parseFloat(pounds) * CONSTANTS.CONVERSIONS.GRAMS_POUND +
            parseFloat(ounces) * CONSTANTS.CONVERSIONS.GRAMS_OUNCE,
          10,
        );
    }
  }, [unit, weightDetected, pounds, ounces]);

  const confirmSave = useCallback(async () => {
    if (weight !== CONSTANTS.DISCONNECTED_MESSAGE) {
      const weightGrams = convertWeight();

      if (goal && weightGrams > goal) {
        const user = await retrieveUserData();
        const title = I18n.t(CONSTANTS.SCREEN_WEIGH_MESSAGES.CONGRATULATIONS, user.name);
        toast(title);
      }

      navigate(CONSTANTS.SCREEN_SAVE, {
        [CONSTANTS.SCREEN_SAVE_PARAM_WEIGHT]: weightGrams,
        selectedUnit,
      });
    }
  }, [weight, convertWeight, goal, navigate, selectedUnit]);

  const cycleUnitTo = useCallback(
    async (desiredUnit) => {
      // Throttle rapid taps to prevent BLE command backlog
      const now = Date.now();
      if (now - lastUnitSwitchRef.current < 300) {
        return;
      }
      lastUnitSwitchRef.current = now;

      // Optimistically update selection for snappier UI
      if (desiredUnit !== selectedUnit) {
        setSelectedUnit(desiredUnit);
      }

      if (bluetoothDevice) {
        try {
          setIsSwitchingUnit(true);
          await bluetoothDevice.writeCharacteristicWithResponseForService(
            CONSTANTS.SERVICE_UUID,
            CONSTANTS.CHARACTERISTIC_UUID,
            CONSTANTS.SCALE_FUNCTIONS.UNIT,
          );
        } catch (e) {
          console.error('Unit switch write failed:', e);
        } finally {
          setIsSwitchingUnit(false);
        }
      }
    },
    [bluetoothDevice, selectedUnit],
  );

  const handleToggleAutoSpeaking = useCallback(async () => {
    const newValue = !autoSpeak;
    setAutoSpeak(newValue);
    await AsyncStorage.setItem(CONSTANTS.SETTINGS.AUTO_SPEAK_KEY, JSON.stringify(newValue));
  }, [autoSpeak]);

  const scaleFunction = useCallback(
    async (scaleFunction) => {
      if (bluetoothDevice) {
        return bluetoothDevice.writeCharacteristicWithResponseForService(
          CONSTANTS.SERVICE_UUID,
          CONSTANTS.CHARACTERISTIC_UUID,
          scaleFunction,
        );
      }
    },
    [bluetoothDevice],
  );

  const handleToggleHoldWeight = useCallback(async () => {
    setIsWeightHold((prevState) => !prevState);
    await scaleFunction(CONSTANTS.SCALE_FUNCTIONS.HOLD);
  }, [scaleFunction]);

  const handleToggleTareToZero = useCallback(async () => {
    if (isWeightStatic) {
      await handleToggleHoldWeight();
      await scaleFunction(CONSTANTS.SCALE_FUNCTIONS.TARE);
      setIsWeightStatic(false);
    }
  }, [isWeightStatic, handleToggleHoldWeight, scaleFunction]);
  return (
    <FLContainer>
      <FLContainer style={styles.displayPane}>
        <FLText style={styles.errorText}>{connectionStatus}</FLText>
        <FLContainer style={styles.modePane}>
          <MWModeButton title="Kg" onPress={() => cycleUnitTo(CONSTANTS.SCALE_UNITS.KILO)} selected={kgSelected} />
          <MWModeButton title="Lb" onPress={() => cycleUnitTo(CONSTANTS.SCALE_UNITS.POUND)} selected={lbSelected} />
          <MWModeButton
            title="Lb:Oz"
            onPress={() => cycleUnitTo(CONSTANTS.SCALE_UNITS.POUND_OUNCE)}
            selected={lbozSelected}
          />
        </FLContainer>
        <FLContainer style={styles.weightPane} onPress={() => reconnect()} blink={true}>
          <FLText style={weight ? weightText : weightText2}>
            {weight || I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.DISCONNECT)}
          </FLText>
        </FLContainer>
      </FLContainer>
      <FLContainer style={styles.functionPane}>
        <MWScaleButton
          title={I18n.t(CONSTANTS.SCREEN_WEIGH_MESSAGES.TARE)}
          icon="refresh"
          onPress={() => handleToggleTareToZero()}
        />
        <MWScaleButton
          title={I18n.t(CONSTANTS.SCREEN_WEIGH_MESSAGES.HOLD)}
          icon={isWeightHold ? 'play' : 'pause'}
          onPress={() => handleToggleHoldWeight()}
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
