import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, ViewPropTypes, Text} from 'react-native';
import FLText from 'components/core/FLText';
import FLContainer from 'components/core/FLContainer';
import styles from './styles';

const MWModeButton = ({title, selected, style, textStyle, ...buttonProps}) => {
  const textStyleX = selected ? styles.textSelected : styles.text;
  return (
    <TouchableOpacity {...buttonProps} style={[styles.button, style]}>
      <FLContainer style={styles.container}>
        <FLText style={[textStyleX, textStyle]}>{title}</FLText>
      </FLContainer>
    </TouchableOpacity>
  );
};

MWModeButton.propTypes = {
  ...TouchableOpacity.propTypes,
  title: PropTypes.string,
  selected: PropTypes.bool,
  style: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
};

export default MWModeButton;
