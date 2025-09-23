import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FLText from 'components/core/FLText';
import FLContainer from 'components/core/FLContainer';
import styles, {iconColor, iconSize} from './styles';

const MWScaleButton = ({title, icon, ...buttonProps}) => (
  <TouchableOpacity {...buttonProps} style={styles.button}>
    <FLContainer style={styles.container}>
      <Icon name={icon} color={iconColor} size={iconSize} />
      <FLText style={styles.text}>{title}</FLText>
    </FLContainer>
  </TouchableOpacity>
);

MWScaleButton.propTypes = {
  ...TouchableOpacity.propTypes,
  title: PropTypes.string,
  icon: PropTypes.string,
};

export default MWScaleButton;
