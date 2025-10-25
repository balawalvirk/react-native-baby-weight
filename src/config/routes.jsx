import React, {useEffect, useContext, useCallback, useRef} from 'react';
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
import REGEXPS from 'config/regExps';

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

  // const disconnectSubRef = useRef(null);

  // const deviceConnectionMonitoring = useCallback(() => {
  //   if (!bluetoothDeviceId) return () => {};

  //   console.log('Setting up disconnect monitoring for', bluetoothDeviceId);

  //   // remove old listener if exists
  //   if (disconnectSubRef.current) {
  //     disconnectSubRef.current.remove();
  //     disconnectSubRef.current = null;
  //   }

  //   // create new listener once
  //   disconnectSubRef.current = manager.onDeviceDisconnected(bluetoothDeviceId, (error, device) => {
  //     console.log('Disconnected event:', error?.message, device?.id);
  //     resetStates();
  //   });

  //   // cleanup
  //   return () => {
  //     if (disconnectSubRef.current) {
  //       disconnectSubRef.current.remove();
  //       disconnectSubRef.current = null;
  //     }
  //   };
  // }, [bluetoothDeviceId, resetStates]);

  // useEffect(() => {
  //   // Start monitoring for device disconnects and clean up on unmount or id change
  //   const cleanup = deviceConnectionMonitoring();
  //   return cleanup;
  // }, [deviceConnectionMonitoring]);

  // // Add a keepalive ping to maintain connection
  // useEffect(() => {
  //   if (!isConnected || !bluetoothDeviceId) return;

  //   console.log('Setting up keepalive ping for device:', bluetoothDeviceId);

  //   // Ping the device every 30 seconds to keep the connection alive
  //   const keepaliveInterval = setInterval(async () => {
  //     try {
  //       // Try to read RSSI as a lightweight operation to keep connection active
  //       await manager.readRSSIForDevice(bluetoothDeviceId);
  //       console.log('Keepalive ping sent');
  //     } catch (error) {
  //       console.log('Keepalive ping failed:', error);
  //       // Don't reset connection here, let the disconnect handler handle it
  //     }
  //   }, 30000); // 30 seconds

  //   return () => {
  //     clearInterval(keepaliveInterval);
  //   };
  // }, [isConnected, bluetoothDeviceId]);

  // useEffect(() => {
  //   // Monitor characteristics only while connected; ensure cleanup when dependencies change
  //   if (!isConnected || !bluetoothDeviceId) return;

  //   const cleanup = monitorValues();

  //   return () => {
  //     if (cleanup && typeof cleanup === 'function') {
  //       cleanup();
  //     }
  //   };
  // }, [isConnected, bluetoothDeviceId]);

  // const monitorValues = () => {
  //   let retryCount = 0;
  //   const maxRetries = 3;

  //   const startMonitoring = () => {
  //     const subscription = manager.monitorCharacteristicForDevice(
  //       bluetoothDeviceId,
  //       CONSTANTS.SERVICE_UUID,
  //       CONSTANTS.CHARACTERISTIC_UUID,
  //       (error, characteristic) => {
  //         if (error) {
  //           console.error('Monitor error:', error);

  //           // Check if the error is due to disconnection using regex
  //           if (error?.message && REGEXPS.deviceDisconnectError.test(error.message)) {
  //             // Device is disconnected, clean up states
  //             if (bluetoothDeviceId && isConnected) {
  //               manager.cancelDeviceConnection(bluetoothDeviceId).catch(() => {});
  //             }
  //             resetStates();

  //             return;
  //           }

  //           // Also check for 'not connected' errors
  //           if (error?.message?.includes('not connected')) {
  //             // Device is disconnected, clean up states
  //             if (bluetoothDeviceId && isConnected) {
  //               manager.cancelDeviceConnection(bluetoothDeviceId).catch(() => {});
  //             }
  //             resetStates();

  //             return;
  //           }

  //           if (retryCount < maxRetries) {
  //             retryCount++;
  //             console.log(`Retrying monitor (${retryCount}/${maxRetries})...`);
  //             // Wait a bit before retrying
  //             setTimeout(() => {
  //               // Restart monitoring only if device is still connected
  //               if (isConnected && bluetoothDeviceId) {
  //                 const newSubscription = startMonitoring();
  //                 // Since we can't easily replace the outer subscription,
  //                 // we'll let the useEffect handle the cleanup when dependencies change
  //               }
  //             }, 1000);
  //           } else {
  //             setConnectionStatus(checkError(error));
  //           }
  //           return;
  //         }

  //         // Reset retry count on successful monitoring
  //         retryCount = 0;
  //         setStates(convertWeightValues(characteristic?.value ?? ''));
  //         setConnectionStatus(I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.CONNECTED));
  //       },
  //     );
  //     return subscription;
  //   };

  //   const subscription = startMonitoring();
  //   return () => subscription.remove();
  // };

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
