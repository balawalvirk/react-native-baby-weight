import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {Keyboard, KeyboardAvoidingView, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FLContainer from 'components/core/FLContainer';
import FLText from 'components/core/FLText';
import FLImagePicker from 'components/external/FLImagePicker';
import FLTextInput from 'components/core/FLTextInput';
import FLDatePicker from 'components/external/FLDatePicker';
import FLFancyButton from 'components/external/FLFancyButton';
import CONSTANTS from 'config/constants';
import UUIDGenerator from 'react-native-uuid-generator';
import I18n from 'react-native-i18n';
import FLPicker from 'components/core/FLPicker';
import globalStyles from 'config/styles';
import toast from 'utils/toast';
import regExps from 'config/regExps';
import {useNavigation, useRoute} from '@react-navigation/native';
import alertMessage from 'utils/alertMessage';
import retrieveUserData from 'utils/getUserData';
import styles from './styles';

const EditProfile = () => {
  const [newProfile, setNewProfile] = useState();
  const navigation = useNavigation();
  const route = useRoute();

  const retrieveData = async ({loadProfile}) => {
    const user = await retrieveUserData(loadProfile);
    setUserData(user);
  };

  const checkProfile = () => {
    const newProfile = route.params?.[CONSTANTS.SCREEN_EDIT_PROFILE_PARAM_NEW];
    const loadProfile = route.params?.[CONSTANTS.SCREEN_EDIT_PROFILE_PARAM_EDIT];
    setNewProfile(newProfile);

    if (!newProfile || loadProfile) {
      retrieveData(loadProfile);
    } else {
      createNewUser();
    }
  };

  useEffect(() => {
    checkProfile();
  }, []);

  const storeUserData = async () => {
    try {
      // const user = JSON.stringify({...userData, goal: userData.goal * CONSTANTS.CONVERSIONS.GRAMS_KILO});
      const user = JSON.stringify({...userData, goal: userData.goal});

      console.log('retrieveUsersData data', user);

      await AsyncStorage.setItem(userData.key, user);
    } catch (error) {
      toast(I18n.t('STORAGE_ERROR'));
      console.log('ERROR', error);
    }
  };

  const retrieveUsers = async () => {
    try {
      const value = await AsyncStorage.getItem(CONSTANTS.USERS_KEY);

      if (value) {
        retrieveUsersData(JSON.parse(value));
      } else {
        saveUser();
      }
    } catch (error) {
      console.log('retrieveUsers', error);
      toast(I18n.t('STORAGE_ERROR'));
    }
  };

  const retrieveUsersData = async (users) => {
    if (newProfile) {
      const usersData = await AsyncStorage.multiGet(users);

      if (usersData) {
        const usersName = usersData.map((item) => JSON.parse(item[1]));

        findDuplicateUsername(usersName);
      }
    } else {
      saveUser();
    }
  };

  const findDuplicateUsername = (users) => {
    const duplicateUsername = users.find((item) => item.name === userData.name && item.key !== userData.key);
    if (duplicateUsername) {
      alertMessage(I18n.t('EDIT_PROFILE.DUPLICATE_USERNAME'), saveUser);
    } else {
      saveUser();
    }
  };

  const saveUser = () => {
    storeUserData();
    storeCurrentUser();
    updateUsers();
  };

  const storeCurrentUser = async () => {
    try {
      await AsyncStorage.setItem(CONSTANTS.CURRENT_USER_KEY, userData.key);
    } catch (error) {
      console.log('storeCurrentUser error', error);
      toast(I18n.t('STORAGE_ERROR'));
    }
  };

  const updateUsers = async () => {
    try {
      const value = await AsyncStorage.getItem(CONSTANTS.USERS_KEY);

      if (value) {
        let users = JSON.parse(value);
        if (!users.includes(userData.key)) {
          users.push(userData.key);
        }
        users = JSON.stringify(users);
        await AsyncStorage.setItem(CONSTANTS.USERS_KEY, users);
        navigation.goBack();
      } else {
        const users = JSON.stringify([userData.key]);
        await AsyncStorage.setItem(CONSTANTS.USERS_KEY, users);
        navigation.goBack();
      }
    } catch (error) {
      console.log('updateUsers error', error);

      toast(I18n.t('STORAGE_ERROR'));
    }
  };

  
  const createNewUser = () => {
    UUIDGenerator.getRandomUUID((uuid) => {
      const today = moment().format(CONSTANTS.DATE_FORMATS.DEFAULT);
      const data = [];
      const newUser = {
        key: uuid,
        image: CONSTANTS.DEFAULT_PROFILE_PIC,
        dob: today,
        isMale: true,
        data,
        goal: '',
        selectedUnit: CONSTANTS.SCALE_UNITS.KILO,
      };

      setUserData(newUser);
    });
  };

  const onChangeInputHandler = (inputName) => (value) => {
    setUserData((prevState) => ({
      ...prevState,
      [inputName]: value,
    }));
  };


  const [userData, setUserData] = useState({
    goal: '', 
    selectedUnit: '', 
    dob: '', 
    name: ''
  });
  const profileImage = userData.image || CONSTANTS.DEFAULT_PROFILE_PIC;

  const { goal, selectedUnit, dob, name } = userData;

  const onChangeInputGoalHandler = (t) => {
    const regex = /^\d*\.?\d*$/; // Matches decimal numbers
    if (regex.test(t)) {
      setUserData((prevState) => ({
        ...prevState,
        goal: t // Update the goal in userData directly
      }));
    }
  };

  const removeDotInEnd = () => {
    let value = userData.goal.toString(); // Ensure value is a string
    if (value.endsWith('.')) {
      value = value.slice(0, -1);
      setUserData((prevState) => ({
        ...prevState,
        goal: value
      }));
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        setUserData((prevState) => ({
          ...prevState,
          goal: parsedValue
        }));
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.keyboardAvoidingView}
      behavior={CONSTANTS.KEYBOARD_AVOIDING_VIEW_BEHAVIOUR}>
      <FLContainer style={styles.container} onPress={() => Keyboard.dismiss()}>
        <FLText style={styles.text}>{I18n.t('EDIT_PROFILE.ADD_IMAGE')}</FLText>
        <FLImagePicker style={styles.image} image={profileImage} onChangeImage={onChangeInputHandler('image')} />
        <FLTextInput
          style={styles.editText}
          placeholder={I18n.t('EDIT_PROFILE.NAME')}
          defaultValue={name}
          returnKeyType="done"
          keyboardType="default"
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={onChangeInputHandler('name')}
        />
        <FLDatePicker style={styles.picker} initialDate={dob} onDateChange={onChangeInputHandler('dob')} />
        <View style={styles.editGoalContainer}>
          <FLTextInput
            style={styles.editGoalText}
            placeholder={`${I18n.t('EDIT_PROFILE.GOAL')} `}
            value={goal} // Ensure a default value
            returnKeyType="done"
            keyboardType="decimal-pad"
            onBlur={removeDotInEnd}
            autoCorrect={false}
            onChangeText={(t) => onChangeInputGoalHandler(t)}
            maxLength={5}
          />
          <FLPicker
            onValueChange={onChangeInputHandler('selectedUnit')}
            style={styles.picker}
            pickerItems={CONSTANTS.SELECT_UNITS}
            value={selectedUnit}
          />
        </View>
        <FLContainer style={styles.buttonPane}>
          <FLFancyButton title={I18n.t('SAVE')} onPress={() => retrieveUsers()} />
        </FLContainer>
      </FLContainer>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
