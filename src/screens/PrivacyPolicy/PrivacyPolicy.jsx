import React from 'react';
import {WebView} from 'react-native-webview';
import constants from 'config/constants';
import styles from './styles';

const PrivacyPolicy = () => (

  <WebView
    style={styles.innerContainer}
    source={{uri: constants.PRIVACY_POLICY_URL}}
    javaScriptEnabled
    domStorageEnabled
    startInLoadingState
    useWebKit
  />
);

export default PrivacyPolicy;
