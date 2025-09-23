import React, {useEffect, useContext, useCallback} from 'react';
import PrivacyPolicy from 'screens/PrivacyPolicy';
import Language from 'screens/Language';
import SocialShare from 'screens/SocialShare';
import Save from 'screens/Save';
import Settings from 'screens/Settings';
import Profiles from 'screens/Profiles';
import EditProfile from 'screens/EditProfile';
import Data from 'screens/Data';
import Graph from 'screens/Graph';
import Weigh from 'screens/Weigh';
import Home from 'screens/Home';
import manager from 'utils/BleManager';
import {BluetoothContext} from 'context';
import {NavigationContainer} from '@react-navigation/native';
import {checkError} from 'utils/checkBluetoothError';
import {convertWeightValues} from 'utils/convertWeightValues';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import I18n from 'react-native-i18n';
import NAVIGATION_OPTIONS from 'config/navigation';
import CONSTANTS from './constants';

const {Navigator, Screen} = createNativeStackNavigator();

function AppNavigator() {
  const {
    store: {
      bluetoothDeviceId: [bluetoothDeviceId],
      states: [, setStates],
      isConnected: [isConnected],
      connectionStatus: [, setConnectionStatus],
    },
    resetStates,
  } = useContext(BluetoothContext);

  const deviceConnectionMonitoring = useCallback(() => {
    const subscription = manager.onDeviceDisconnected(bluetoothDeviceId, () => {
      resetStates();
    });
    return () => subscription.remove();
  }, [bluetoothDeviceId]);

  useEffect(() => {
    deviceConnectionMonitoring();
  });

  useEffect(() => {
    if (isConnected) {
      monitorValues();
    }
  }, [isConnected]);

  const monitorValues = () => {
    const subscription = manager.monitorCharacteristicForDevice(
      bluetoothDeviceId,
      CONSTANTS.SERVICE_UUID,
      CONSTANTS.CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) {
          setConnectionStatus(checkError(error));
          return;
        }
        setStates(convertWeightValues(characteristic?.value ?? ''));
        setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.CONNECTED));
      },
    );
    return () => subscription.remove;
  };

  return (
    <NavigationContainer>
      <Navigator screenOptions={NAVIGATION_OPTIONS.SCREEN_OPTIONS} initialRouteName={CONSTANTS.SCREEN_HOME}>
        <Screen name={CONSTANTS.SCREEN_DATA} component={Data} />
        <Screen
          name={CONSTANTS.SCREEN_EDIT_PROFILE}
          component={EditProfile}
          options={NAVIGATION_OPTIONS.EDIT_PROFILE}
        />
        <Screen name={CONSTANTS.SCREEN_GRAPH} component={Graph} options={NAVIGATION_OPTIONS.GRAPH} />
        <Screen name={CONSTANTS.SCREEN_HOME} component={Home} options={NAVIGATION_OPTIONS.HOME} />
        <Screen name={CONSTANTS.SCREEN_LANGUAGE} component={Language} options={NAVIGATION_OPTIONS.LANGUAGE} />
        <Screen
          name={CONSTANTS.SCREEN_PRIVACY_POLICY}
          component={PrivacyPolicy}
          options={NAVIGATION_OPTIONS.PRIVACY_POLICY}
        />
        <Screen name={CONSTANTS.SCREEN_PROFILES} component={Profiles} options={NAVIGATION_OPTIONS.PROFILES} />
        <Screen name={CONSTANTS.SCREEN_SAVE} component={Save} options={NAVIGATION_OPTIONS.SAVE} />
        <Screen name={CONSTANTS.SCREEN_SETTINGS} component={Settings} options={NAVIGATION_OPTIONS.SETTINGS} />
        <Screen name={CONSTANTS.SCREEN_SHARE} component={SocialShare} options={NAVIGATION_OPTIONS.SOCIAL_SHARE} />
        <Screen name={CONSTANTS.SCREEN_WEIGH} component={Weigh} options={NAVIGATION_OPTIONS.WEIGH} />
      </Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
