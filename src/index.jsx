import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {LogBox} from 'react-native';
import AppNavigator from './config/routes';
import {BluetoothContextProvider} from './context';
import {configureLocalization} from './localization';

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
