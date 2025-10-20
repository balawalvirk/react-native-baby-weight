import CONSTANTS from 'config/constants';
import {Alert, Linking} from 'react-native';
import I18n from 'react-native-i18n';
import {PERMISSIONS} from 'react-native-permissions';
import manager from 'utils/BleManager';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

export const scanDevice = () => {
  return new Promise((res, rej) => {
    manager.startDeviceScan(null, null, (error, device) => {
      let data = {};
      console.log('Paired devices:', JSON.stringify(device, null, 2));
      if (device?.name === CONSTANTS.DEVICE_NAME) {
        manager.stopDeviceScan();
        data = {...data, status: I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.CONNECTING), id: device?.id};
        res(data);
      }
      if (error?.message === 'BluetoothLE is powered off') {
        Alert.alert(
          'Bluetooth Required',
          'Bluetooth is not enabled. Please enable Bluetooth in your settings.',
          [
            {
              text: 'Open Settings',
              onPress: () => RNBluetoothClassic.requestBluetoothEnabled(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
          {cancelable: true},
        );
      }
      if (error) {
        Alert.alert('Connection error', error?.message || 'Something went wrong');
        console.log(error.message, 'message');
        manager.stopDeviceScan();
        rej(error);
      }
    });
  });
};

export const connectToDevice = async (bluetoothDeviceId, retryCount = 3) => {
  let attempt = 0;

  const tryConnect = async () => {
    try {
      // Stop any ongoing scan
      manager.stopDeviceScan();

      // Check if the device is already connected
      const isConnected = await manager.isDeviceConnected(bluetoothDeviceId);
      if (isConnected) {
        const devices = await manager.devices([bluetoothDeviceId]);
        if (devices && devices.length > 0) {
          // Ensure services are discovered
          await devices[0].discoverAllServicesAndCharacteristics();
          return {device: devices[0], connection: true};
        }
      }

      // Attempt to connect to the device
      const device = await manager.connectToDevice(bluetoothDeviceId, {
        autoConnect: false, // Changed to false for more reliable initial connection
        timeout: 10000, // Increased timeout for better connection chance
      });

      if (!device) {
        throw new Error('Failed to connect to device');
      }

      // Wait a bit before discovering services
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Discover services and characteristics
      await device.discoverAllServicesAndCharacteristics();

      // Wait a bit after discovering services
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Verify the connection
      const connection = await manager.isDeviceConnected(bluetoothDeviceId);

      if (connection) {
        return {device, connection: true};
      } else {
        throw new Error('Device connection verification failed');
      }
    } catch (error) {
      console.error(`Error connecting to device (Attempt ${attempt + 1}):`, error);

      // Clean up failed connection attempt
      try {
        await manager.cancelDeviceConnection(bluetoothDeviceId);
        // Wait a bit after canceling connection
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (cleanupError) {
        console.error('Error cleaning up failed connection:', cleanupError);
      }

      attempt += 1;
      if (attempt < retryCount) {
        console.log(`Retrying connection... (${attempt + 1}/${retryCount})`);
        // Wait longer before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return await tryConnect();
      } else {
        return {error: error.message || 'Failed to connect to device after multiple attempts'};
      }
    }
  };

  return await tryConnect();
};

// import CONSTANTS from 'config/constants';
// import {Alert, Linking, NativeEventEmitter, NativeModules} from 'react-native';
// import I18n from 'react-native-i18n';
// import {PERMISSIONS, request} from 'react-native-permissions';
// import BleManager from 'react-native-ble-manager';

// const BleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// BleManager.start({showAlert: false});

// export const scanDevice = () => {
//   return new Promise((res, rej) => {
//     BleManager.scan([], 5, true)
//       .then(() => {
//         console.log('Scanning...');
//       })
//       .catch((err) => {
//         console.error(err);
//         rej(err);
//       });

//     const handleDiscoverPeripheral = (device) => {
//       let data = {};
//       console.log('Discovered device:', JSON.stringify(device, null, 2));
//       if (device && device.name) {
//         BleManager.stopScan().then(() => {
//           data = {
//             ...data,
//             status: I18n.t(CONSTANTS.BLE_CONNECTION_STATUS.CONNECTING),
//             id: device.id,
//           };
//           res(data);
//         });
//       }
//     };

//     const handleStopScan = () => {
//       console.log('Scan stopped');
//       bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
//     };

//     const handleError = (error) => {
//       if (error?.message === 'BluetoothLE is powered off') {
//         Alert.alert(
//           'Bluetooth Required',
//           'Bluetooth is not enabled. Please enable Bluetooth in your settings.',
//           [
//             {
//               text: 'Open Settings',
//               onPress: () => Linking.openSettings(),
//             },
//             {
//               text: 'Cancel',
//               style: 'cancel',
//             },
//           ],
//           {cancelable: true},
//         );
//       } else {
//         Alert.alert('Connection error', error?.message || 'Something went wrong');
//         console.error(error.message, 'message');
//       }
//       BleManager.stopScan();
//       rej(error);
//     };

//     bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
//     bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
//     bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleError);
//     bleManagerEmitter.addListener('BleManagerStopScan', handleError);
//   });
// };

// export const connectToDevice = async (bluetoothDeviceId, retryCount = 3) => {
//   let attempt = 0;

//   const tryConnect = async () => {
//     try {
//       // Check if the device is already connected
//       const connectedDevices = await BleManager.getConnectedPeripherals([]);
//       const isConnected = connectedDevices.some((device) => device.id === bluetoothDeviceId);

//       if (isConnected) {
//         BleManager.stopScan();
//         const device = connectedDevices.find((device) => device.id === bluetoothDeviceId);
//         return {device, connection: true};
//       }

//       // Attempt to connect to the device
//       await BleManager.connect(bluetoothDeviceId);
//       await BleManager.retrieveServices(bluetoothDeviceId);

//       // Verify the connection
//       const connection = connectedDevices.some((device) => device.id === bluetoothDeviceId);
//       if (connection) {
//         const device = connectedDevices.find((device) => device.id === bluetoothDeviceId);
//         return {device, connection};
//       } else {
//         return {device: null, connection: false};
//       }
//     } catch (error) {
//       console.error(`Error connecting to device (Attempt ${attempt + 1}):`, error);
//       scanDevice();
//       attempt += 1;

//       if (attempt < retryCount) {
//         console.log(`Retrying connection... (${attempt + 1}/${retryCount})`);
//         return await tryConnect();
//       } else {
//         return {error: error.message || 'Failed to connect to device after multiple attempts'};
//       }
//     }
//   };

//   return await tryConnect();
// };
