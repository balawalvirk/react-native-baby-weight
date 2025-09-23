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
import React, {useContext, useEffect, useState} from 'react';
// import BleManager from 'react-native-ble-manager';
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
import BleManager from 'react-native-ble-manager';
import RNBluetoothClassic, {BluetoothClassic} from 'react-native-bluetooth-classic';
import {Alert, NativeEventEmitter, NativeModules, View} from 'react-native';
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
  useEffect(() => {

    return () => {
      // Stop the BLE manager and unsubscribe from events when the component unmounts
      manager.stop();
      manager.removeAllListeners();
    };
  }, []);

  const stopDiscovery = async () => {
    try {
      await RNBluetoothClassic.cancelDiscovery();
      console.log('Discovery stopped');
    } catch (err) {
      console.error('Error stopping discovery:', err);
    }
  };
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    getGoal();

    if (!bluetoothDeviceId) {
      setWeight(null);
      requestLocationPermission();
    }


  }, [bluetoothDeviceId]);

  useEffect(() => {
    if (bluetoothDeviceId && !isConnected) {
      connect();
    }
  }, [bluetoothDeviceId, isConnected]);

  useEffect(() => {
    if (isConnected) {
      updateValue();
    }
  }, [states, isConnected]);

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        requestLocationPermission();

        subscription.remove();
      }

    }, true);
    return () => subscription.remove();
  }, [manager]);

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
          let peripheral = results[i];
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

    connectToDevice(bluetoothDeviceId)
      .then((data) => {
        setBluetoothDevice(data.device);
        setIsConnected(data.connection);
      })
      .catch((error) => setConnectionStatus(checkError(error)));

    setUnitData();
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

  const updateValue = () => {
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
  };


  const speak = (speechText) => {
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
  };

  const reconnect = () => {
    requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ])
      .then((res) => {
        console.log(res);
        // if (!bluetoothDeviceId) {
        // manager.stopDeviceScan();
        scan();

        // }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const convertWeight = () => {
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
  };

  const confirmSave = async () => {
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
  };

  const cycleUnitTo = async (unit) => {
    if (bluetoothDevice && unit !== selectedUnit) {
      await bluetoothDevice.writeCharacteristicWithResponseForService(
        CONSTANTS.SERVICE_UUID,
        CONSTANTS.CHARACTERISTIC_UUID,
        CONSTANTS.SCALE_FUNCTIONS.UNIT,
      );
    }
  };

  const handleToggleAutoSpeaking = () => {
    setAutoSpeak((prevState) => !prevState);
  };

  const handleToggleHoldWeight = async () => {
    setIsWeightHold((prevState) => !prevState);

    await scaleFunction(CONSTANTS.SCALE_FUNCTIONS.HOLD);
  };

  const scaleFunction = async (scaleFunction) => {
    if (bluetoothDevice) {
      return bluetoothDevice.writeCharacteristicWithResponseForService(
        CONSTANTS.SERVICE_UUID,
        CONSTANTS.CHARACTERISTIC_UUID,
        scaleFunction,
      );
    }
  };

  const handleToggleTareToZero = async () => {
    if (isWeightStatic) {
      await handleToggleHoldWeight();
      await scaleFunction(CONSTANTS.SCALE_FUNCTIONS.TARE);
      setIsWeightStatic(false), () => scaleFunction(CONSTANTS.SCALE_FUNCTIONS.TARE);
    }
  };
  return (
    <FLContainer>
      <FLContainer style={styles.displayPane}>
        <FLText style={styles.errorText}>{connectionStatus}</FLText>
        <FLContainer style={styles.modePane}>
          <MWModeButton title="Kilos" onPress={() => cycleUnitTo(CONSTANTS.SCALE_UNITS.KILO)} selected={kgSelected} />
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

