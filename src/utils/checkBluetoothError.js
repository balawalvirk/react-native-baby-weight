import _ from 'lodash-es';
import CONSTANTS from 'config/constants';
import I18n from 'react-native-i18n';

export const checkError = (error) => {
  if (_.has(CONSTANTS.BLE_ERROR_CODES, error.errorCode)) {
    return I18n.t(CONSTANTS.BLE_ERROR_CODES[error.errorCode]);
  } else {
    `ERROR: ${error.message}`;
  }
};
