import React, {createContext, useState} from 'react';

export const BluetoothContext = createContext();

const BluetoothContextProvider = ({children}) => {
  const store = {
    bluetoothDeviceId: useState(''),
    states: useState(''),
    bluetoothDevice: useState(''),
    isConnected: useState(false),
    isWeightHold: useState(false),
    connectionStatus: useState(''),
  };

  const resetStates = () => {
    const {
      bluetoothDeviceId: [, setBluetoothDeviceId],
      bluetoothDevice: [, setBluetoothDevice],
      states: [, setStates],
      isConnected: [, setIsConnected],
      isWeightHold: [, setIsWeightHold],
    } = store;

    setBluetoothDeviceId('');
    setBluetoothDevice('');
    setIsConnected(false);
    setIsWeightHold(false);
    setStates('');
  };

  const providerValue = {
    store,
    resetStates,
  };
  return <BluetoothContext.Provider value={providerValue}>{children}</BluetoothContext.Provider>;
};

export default BluetoothContextProvider;
