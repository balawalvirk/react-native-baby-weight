import React from 'react';
import {Text,View} from 'react-native';
import styles from './styles';

// const FLHeaderTitle = ({title}) => {
//   return <Text style={styles.header}>{title}</Text>;
// };

// export default FLHeaderTitle;
const FLHeaderTitle = ({ title, middle }) => {
  return (
    <View style={middle ? styles.center : styles.headerContainer}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  ); 
};

export default FLHeaderTitle;
