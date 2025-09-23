import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AppNavigator from './config/routes';
import {BluetoothContextProvider} from './context';
import {configureLocalization} from './localization';
import {LogBox} from 'react-native';

configureLocalization();
LogBox.ignoreAllLogs();
const App = () => (
  <BluetoothContextProvider>
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  </BluetoothContextProvider>
);

export default App;
