import React, {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from 'react-native-i18n';
import {assemble} from 'actions';
import CONSTANTS from 'config/constants';
import FLFab from 'components/external/FLFab';
import FLText from 'components/core/FLText';
import FLContainer from 'components/core/FLContainer';
import FLLoading from 'components/composed/FLLoading';
import toast from 'utils/toast';
import {alertMessage} from 'utils/alertMessage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import retrieveUsers from 'utils/getUsers';
import makeStyles from './styles';

const Profiles = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState();

  const retrieveUsersData = async () => {
    const getUsers = await retrieveUsers();
    setUsers(getUsers);
  };

  useFocusEffect(
    useCallback(() => {
      retrieveUsersData();
    }, []),
  );

  const addNewUser = () => {
    if (users.length < CONSTANTS.MAX_USERS) {
      navigation.navigate(CONSTANTS.SCREEN_EDIT_PROFILE, {
        [CONSTANTS.SCREEN_EDIT_PROFILE_PARAM_NEW]: true,
      });
    } else {
      alertMessage({
        type: CONSTANTS.ALERTS.DEFAULT_ALERT,
        title: I18n.t('PROFILES.PROFILE_LIMIT'),
        message: I18n.t('PROFILES.PROFILE_LIMIT_ERR', {count: CONSTANTS.MAX_USERS}),
      });
    }
  };

  const editUser = (userKey) => {
    navigation.navigate(CONSTANTS.SCREEN_EDIT_PROFILE, {
      [CONSTANTS.SCREEN_EDIT_PROFILE_PARAM_EDIT]: userKey,
    });
  };

  const deleteUser = async (userKey) => {
    try {
      const currentUser = await AsyncStorage.getItem(CONSTANTS.CURRENT_USER_KEY);
      const userData = await AsyncStorage.getItem(CONSTANTS.USERS_KEY);
      if (userData) {
        let users = JSON.parse(userData);
        if (users.length > 1) {
          const index = users.indexOf(userKey);
          if (index > -1) {
            users.splice(index, 1);
          }
          if (userKey === currentUser) {
            await AsyncStorage.setItem(CONSTANTS.CURRENT_USER_KEY, users[0]);
          }
          users = JSON.stringify(users);
          await AsyncStorage.setItem(CONSTANTS.USERS_KEY, users);
          retrieveUsersData();
        } else {
          alertMessage({
            type: CONSTANTS.ALERTS.DEFAULT_ALERT,
            title: I18n.t('PROFILES.LAST_PROFILE'),
            message: I18n.t('PROFILES.DELETE_ALL_ERR'),
          });
        }
      }
    } catch (error) {
      toast(I18n.t('STORAGE_ERROR'));
    }
  };

  const storeCurrentUser = async (userKey) => {
    try {
      await AsyncStorage.setItem(CONSTANTS.CURRENT_USER_KEY, userKey);
      navigation.goBack();
    } catch (error) {
      toast(I18n.t('STORAGE_ERROR'));
    }
  };

  const alertManageUser = (name, userKey) => {
    Alert.alert(I18n.t('PROFILES.MANAGE_PROFILE'), name, [
      {text: I18n.t('CANCEL'), style: 'cancel'},
      {
        text: I18n.t('DELETE'),
        onPress: () => alertDeleteProfile(userKey),
        style: 'destructive',
      },
      {text: I18n.t('EDIT'), onPress: () => editUser(userKey), style: 'default'},
    ]);
  };

  const alertDeleteProfile = (userKey) => {
    Alert.alert(I18n.t('PROFILES.DELETE_PROFILE'), I18n.t('PROFILES.DELETE_CONFIRM'), [
      {text: I18n.t('CANCEL'), style: 'cancel'},
      {
        text: I18n.t('DELETE'),
        onPress: () => deleteUser(userKey),
        style: 'destructive',
      },
    ]);
  };

  if (!users) {
    return <FLLoading />;
  }

  const styles = makeStyles();
  const profiles = assemble.makeProfileCards(users, storeCurrentUser, alertManageUser);

  return (
    <FLContainer>
      <FLText style={styles.text}>{I18n.t('PROFILES.CHOOSE_PROFILE')}</FLText>
      <FLContainer style={styles.container} scroll>
        {profiles}
      </FLContainer>
      <FLFab onPress={addNewUser} />
    </FLContainer>
  );
};

export default Profiles;
