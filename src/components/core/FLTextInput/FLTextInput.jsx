import React from 'react';
import {TextInput, Text} from 'react-native';
import PropTypes from 'prop-types';
import styles, {accent} from './styles';

const FLTextInput = ({style, maxLength = 50, ...textProps}) => (
  <TextInput
    editable={true}
    maxLength={maxLength}
    placeholderTextColor={accent}
    selectionColor={accent}
    {...textProps}
    style={[styles.text, style]}
  />
);

FLTextInput.propTypes = {
  ...TextInput.propTypes,
  style: Text.propTypes.style,
  maxLength: PropTypes.number,
};

export default FLTextInput;
