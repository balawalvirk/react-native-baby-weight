import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {useNavigation, useFocusEffect, useRoute} from '@react-navigation/native';
import {Keyboard, KeyboardAvoidingView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UUIDGenerator from 'react-native-uuid-generator';
import retrieveUserData from 'utils/getUserData';
import I18n from 'react-native-i18n';
import {format, weightFormat} from 'utils';
import CONSTANTS from 'config/constants';
import colors from 'config/colors';
import FLFancyButton from 'components/external/FLFancyButton';
import FLTextInput from 'components/core/FLTextInput';
import FLText from 'components/core/FLText';
import FLImagePicker from 'components/external/FLImagePicker';
import FLContainer from 'components/core/FLContainer';
import FLLoading from 'components/composed/FLLoading';
import FLToolbarIcon from 'components/external/FLToolbarIcon';
import globalStyles from 'config/styles';
import styles from './styles';

const Save = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [userData, setUserData] = useState();
  const [state, setState] = useState();
  const [notes, setNotes] = useState('notes');
  const [image, setImage] = useState('');

  const formattedWeight = useMemo(() => {
    if (state) {
      return weightFormat.recountWeight({
        unit: state.selectedUnit,
        weight: state.weight,
      });
    }
  }, [state]);

  const retrieveData = async () => {
    const user = await retrieveUserData();
    setUserData(user);
  };

  const retieveParams = () => {
    const weight = route.params?.[CONSTANTS.SCREEN_SAVE_PARAM_WEIGHT];
    const selectedUnit = route.params?.selectedUnit;
    const date = new Date();
    setState({
      ...state,
      weight,
      date,
      selectedUnit,
    });
  };

  useFocusEffect(
    useCallback(() => {
      retrieveData();
      retieveParams();
    }, []),
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <FLToolbarIcon icon={CONSTANTS.SCREEN_SHARE_ICON} onPress={() => shareSave()} />,
    });
  }, [navigation, state, notes, userData]);

  const storeUserData = () => {
    const {weight, date, selectedUnit} = state;
    UUIDGenerator.getRandomUUID((uuid) => {
      const {data} = userData;
      data.push({
        key: uuid,
        weight,
        date: date.valueOf(),
        image,
        notes,
      });
      const userAdit = JSON.stringify({
        ...userData,
        data,
        selectedUnit,
      });
      AsyncStorage.setItem(userData.key, userAdit);
    });
  };

  const confirmSave = () => {
    storeUserData();
    navigation.popToTop();
  };

  const shareSave = () => {
    storeUserData();
    const {weight, date} = state;
    const data = {
      [CONSTANTS.SCREEN_SHARE_PARAM_DATA]: {
        weight,
        date,
        image,
        notes,
      },
    };
    navigation.navigate(CONSTANTS.SCREEN_SHARE, data);
  };

  if (!userData) {
    return <FLLoading />;
  }
  const {name} = userData;
  const {date} = state;

  return (
    <KeyboardAvoidingView
      style={globalStyles.keyboardAvoidingView}
      behavior={CONSTANTS.KEYBOARD_AVOIDING_VIEW_BEHAVIOUR}>
      <FLContainer style={styles.container} onPress={() => Keyboard.dismiss()}>
        <FLText style={styles.imageText}>{I18n.t('SAVING.ADD_IMAGE')}</FLText>
        <FLImagePicker
          style={styles.image}
          image={image}
          icon={CONSTANTS.ICON_ADD_PHOTO}
          size={120}
          type={CONSTANTS.ADD_PHOTO_ICON_TYPE}
          color={colors.PRIMARY_LIGHT}
          onChangeImage={(image) => setImage(image)}
        />
        <FLContainer style={styles.dataPane}>
          <FLText style={styles.nameText}>{name}</FLText>
          <FLText style={styles.weightText}>{formattedWeight}</FLText>
          <FLText style={styles.dateText}>{format.displayLongDate(date)}</FLText>
        </FLContainer>
        <FLTextInput
          placeholder={I18n.t('SAVING.NOTES')}
          returnKeyType="done"
          blurOnSubmit
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect={false}
          multiline
          maxLength={150}
          scrollEnabled
          onChangeText={(notes) => setNotes(notes)}
          style={styles.editText}
        />
        <FLContainer style={styles.buttonPane}>
          <FLFancyButton title={I18n.t('SAVING.CONFIRM')} onPress={() => confirmSave()} />
        </FLContainer>
      </FLContainer>
    </KeyboardAvoidingView>
  );
};

export default Save;
