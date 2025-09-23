import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from 'react-native-action-button';
import {color} from './styles';

const FLFab = ({onPress}) => <ActionButton buttonColor={color} onPress={onPress} />;

FLFab.propTypes = {
  onPress: PropTypes.func,
};

export default FLFab;
