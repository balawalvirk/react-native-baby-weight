import React from 'react';
import {ListItem} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import CONSTANTS from 'config/constants';
import {updateLanguage} from 'localization';
import FLContainer from 'components/core/FLContainer';
import {FlatList} from 'react-native';
import styles from './styles';

const Language = () => {
  const navigation = useNavigation();
  const handleChooseLanguage = (language) => () => {
    updateLanguage(language);

    navigation.reset({
      index: 0,
      routes: [{name: CONSTANTS.SCREEN_HOME}],
    });
  };

  const renderItem = ({item}) => (
    <FLContainer style={styles.container}>
      <ListItem
        key={item.title}
        containerStyle={styles.listItem}
        title={item.title}
        onPress={handleChooseLanguage(item.code)}
      />
    </FLContainer>
  );

  return <FlatList data={CONSTANTS.LANGUAGES} renderItem={renderItem} keyExtractor={(item) => item.code} />;
};

export default Language;
