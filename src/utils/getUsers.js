import I18n from 'react-native-i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from 'config/constants';

const retrieveUsers = async (keys = CONSTANTS.USERS_KEY) => {
  try {
    const usersKeys = await AsyncStorage.getItem(keys);
    const users = JSON.parse(usersKeys);
    const usersData = await AsyncStorage.multiGet(users);

    if (usersData) {
      return usersData.map((data) => JSON.parse(data[1]));
    }
  } catch (error) {
    alert(I18n.t('STORAGE_ERROR'));
  }
};

export default retrieveUsers;
