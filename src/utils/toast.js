import Toast from 'react-native-root-toast';
import CONSTANTS from 'config/constants';

const toast = (title) =>
  Toast.show(title, {
    duration: CONSTANTS.TOAST_SETTINGS.DURATION,
    position: Toast.positions.center,
    animation: true,
    hideOnPress: true,
    delay: CONSTANTS.TOAST_SETTINGS.DELAY,
  });

export default toast;
