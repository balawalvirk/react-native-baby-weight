import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'react-native-elements';
import styles, {iconColor, underlayColor, iconSize} from './styles';

const FLToolbarIcon = ({icon, type, onPress, color = iconColor, size = iconSize}) => (
  <Icon
    name={icon}
    type={type}
    color={color}
    underlayColor={underlayColor}
    iconStyle={styles.icon}
    size={size}
    onPress={onPress}
  />
);

FLToolbarIcon.propTypes = {
  icon: PropTypes.string,
  type: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

FLToolbarIcon.defaultProps = {
  icon: 'warning',
  type: 'material',
};

export default FLToolbarIcon;
