import React from 'react';
import PropTypes from 'prop-types';
import {View, ScrollView, TouchableOpacity, ViewPropTypes} from 'react-native';
import styles from './styles';

const FLContainer = ({scroll, onPress, blink, style, children, ...passProps}) => {
  if (scroll) {
    return (
      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={[styles.scrollView, style]}
        {...passProps}>
        {children}
      </ScrollView>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.default, style]}
        onPress={onPress}
        activeOpacity={blink ? 0.5 : 1}
        {...passProps}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.default, style]} {...passProps}>
      {children}
    </View>
  );
};

FLContainer.propTypes = {
  ...ViewPropTypes,
  scroll: PropTypes.bool,
  onPress: PropTypes.func,
  blink: PropTypes.bool,
  style: ViewPropTypes.style,
  children: PropTypes.node.isRequired,
};

FLContainer.defaultProps = {
  blink: false,
};

export default FLContainer;
