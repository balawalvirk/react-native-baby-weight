import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FLText from 'components/core/FLText';
import FLContainer from 'components/core/FLContainer';
import styles, {defaultSize, defaultColor} from './styles';

const FLPager = ({text, leftIcon, leftButton, leftColor, leftSize, rightIcon, rightButton, rightColor, rightSize}) => (
  <FLContainer style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={leftButton}>
      <Icon style={styles.icon} name={leftIcon} color={leftColor} size={leftSize} />
    </TouchableOpacity>
    <FLText style={styles.text}>{text}</FLText>
    <TouchableOpacity style={styles.button} onPress={rightButton}>
      <Icon style={styles.icon} name={rightIcon} color={rightColor} size={rightSize} />
    </TouchableOpacity>
  </FLContainer>
);

FLPager.propTypes = {
  text: PropTypes.string.isRequired,
  leftIcon: PropTypes.string.isRequired,
  leftButton: PropTypes.func.isRequired,
  leftColor: PropTypes.string,
  leftSize: PropTypes.number,
  rightIcon: PropTypes.string.isRequired,
  rightButton: PropTypes.func.isRequired,
  rightColor: PropTypes.string,
  rightSize: PropTypes.number,
};

FLPager.defaultProps = {
  leftColor: defaultColor,
  leftSize: defaultSize,
  rightColor: defaultColor,
  rightSize: defaultSize,
};

export default FLPager;
