import React, {useCallback, useState} from 'react';
import {ListItem} from 'react-native-elements';
import FLContainer from 'components/core/FLContainer';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import styles from './styles';
import I18n from 'react-native-i18n';
import CONSTANTS from '../../config/constants';

const settings = [
  {
    title: 'LANGUAGE.TITLE',
    routeName: CONSTANTS.SCREEN_LANGUAGE_TITLE,
  },
  {
    title: 'PRIVACY_POLICY.TITLE',
    routeName: CONSTANTS.SCREEN_PRIVACY_POLICY,
  },
];
const Settings = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState();
  useFocusEffect(
    useCallback(() => {
      setUserData(settings);
    }, []),
  );
  const renderItem = ({item}) => (
    <FLContainer style={styles.container}>
      <ListItem
        key={item.routeName}
        containerStyle={styles.listItem}
        title={I18n.t(item.title)}
        onPress={() => navigation.navigate(item.routeName)}
      />
    </FLContainer>
  );

  return <FlatList data={userData} renderItem={renderItem} keyExtractor={(item) => item.code} />;
};

export default Settings;
