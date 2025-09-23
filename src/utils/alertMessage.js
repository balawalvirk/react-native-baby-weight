import {Alert} from 'react-native';
import I18n from 'react-native-i18n';
import CONSTANTS from 'config/constants';

export const alertMessage = ({
  type,
  title,
  message,
  saveUser,
  buttons = [
    {
      text: I18n.t('CANCEL'),
      onPress: () => {},
    },
    {
      text: I18n.t('OK'),
      onPress: saveUser,
    },
  ],
  options,
}) => {
  switch (type) {
    case CONSTANTS.ALERTS.DEFAULT_ALERT:
    case CONSTANTS.ALERTS.DUPLICATE_USERNAME:
      return Alert.alert(title, message, buttons, options);
  }
};
