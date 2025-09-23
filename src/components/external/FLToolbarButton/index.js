import React from 'react';
import {useNavigation} from '@react-navigation/native';
import FLToolbarIcon from 'components/external/FLToolbarIcon';

const FLToolbarButton = ({icon, screen}) => {
  const navigation = useNavigation();

  return <FLToolbarIcon icon={icon} onPress={() => navigation.navigate(screen)} />;
};
export default FLToolbarButton;
