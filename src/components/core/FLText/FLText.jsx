import React from 'react';
import {PropTypes} from 'prop-types';
import {Text, StyleSheet} from 'react-native';
import styles from './styles';

const FLText = ({style, children}) => <Text style={StyleSheet.flatten([styles.text, style])}>{children}</Text>;

FLText.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.string.isRequired,
};

export default FLText;
