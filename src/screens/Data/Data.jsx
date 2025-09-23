import React, {useCallback, useEffect, useMemo, useState} from 'react';
import CONSTANTS from 'config/constants';
import {Keyboard, KeyboardAvoidingView} from 'react-native';
import I18n from 'react-native-i18n';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {format, weightFormat} from 'utils';
import FLFancyButton from 'components/external/FLFancyButton';
import FLTextInput from 'components/core/FLTextInput';
import FLText from 'components/core/FLText';
import FLImage from 'components/core/FLImage';
import FLContainer from 'components/core/FLContainer';
import FLLoading from 'components/composed/FLLoading';
import globalStyles from 'config/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toast from 'utils/toast';
import retrieveUserData from 'utils/getUserData';
import FLToolbarIcon from 'components/external/FLToolbarIcon';
import styles from './styles';

const Data = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [user, setUser] = useState();
  const [dataKey, setDataKey] = useState();
  const [dataPoint, setDataPoint] = useState();
  const [notes, setNotes] = useState();

  const formattedWeight = useMemo(() => {
    if (user) {
      return weightFormat.recountWeight({
        unit: user.selectedUnit,
        weight: dataPoint.weight,
      });
    }
  }, [user]);

  const retrieveParamsData = () => {
    const data = route.params?.[CONSTANTS.SCREEN_DATA_PARAM_DATA];
    setDataKey(data.key);
    setDataPoint(data.dataPoint);
  };

  const retrieveData = async () => {
    const user = await retrieveUserData();
    setUser(user);
  };

  useFocusEffect(
    useCallback(() => {
      retrieveParamsData();
      retrieveData();
    }, []),
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <FLToolbarIcon icon={CONSTANTS.SCREEN_SHARE_ICON} onPress={() => shareData()} />,
    });
  }, [navigation, dataPoint, notes]);

  const deleteDataPoint = async () => {
    try {
      const indexPoint = user.data.findIndex((item) => item.key === dataKey);
      const newData = user.data;
      newData.splice(indexPoint, 1);

      const updateUser = JSON.stringify({
        ...user,
        data: newData,
      });
      AsyncStorage.setItem(user.key, updateUser);
      navigation.goBack();
    } catch (error) {
      toast(I18n.t('STORAGE_ERROR'));
    }
  };

  const shareData = () => {
    const data = {
      [CONSTANTS.SCREEN_SHARE_PARAM_DATA]: {
        weight: dataPoint.weight,
        date: dataPoint.date,
        image: dataPoint.image,
        notes: notes || dataPoint.notes,
      },
    };
    navigation.navigate(CONSTANTS.SCREEN_SHARE, data);
  };

  if (!user) {
    return <FLLoading />;
  }

  const profileImage = dataPoint.image || CONSTANTS.DEFAULT_PROFILE_PIC;

  return (
    <KeyboardAvoidingView
      style={globalStyles.keyboardAvoidingView}
      behavior={CONSTANTS.KEYBOARD_AVOIDING_VIEW_BEHAVIOUR}>
      <FLContainer style={styles.container} onPress={() => Keyboard.dismiss()}>
        <FLImage style={styles.image} image={profileImage} circle={true} mode="cover" />
        <FLContainer style={styles.dataPane}>
          <FLText style={styles.nameText}>{user.name}</FLText>
          <FLText style={styles.weightText}>{formattedWeight}</FLText>
          <FLText style={styles.dateText}>{format.displayLongDate(dataPoint.date)}</FLText>
        </FLContainer>
        <FLTextInput
          defaultValue={dataPoint.notes}
          placeholder={I18n.t('DATA.NOTES')}
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
          <FLFancyButton title={I18n.t('DELETE')} onPress={() => deleteDataPoint()} />
        </FLContainer>
      </FLContainer>
    </KeyboardAvoidingView>
  );
};

export default Data;
