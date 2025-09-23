import I18n from 'react-native-i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from 'config/constants';

const retrieveUserData = async (userKey) => {
  try {
    const key = userKey || (await AsyncStorage.getItem(CONSTANTS.CURRENT_USER_KEY));

    if (!key) {
      return CONSTANTS.USER_NOT_FOUND;
    }

    const user = await AsyncStorage.getItem(key);

    if (user) {
      return JSON.parse(user);
    }
  } catch (error) {
    alert(I18n.t('STORAGE_ERROR'));
  }
};

export default retrieveUserData;
