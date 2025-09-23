import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Image, ViewPropTypes} from 'react-native';
import styles from './styles';

const FLSocialIcon = ({style, image, ...buttonProps}) => (
  <TouchableOpacity {...buttonProps} style={[styles.button, style]}>
    <Image style={styles.image} source={image} />
  </TouchableOpacity>
);

FLSocialIcon.propTypes = {
  ...TouchableOpacity.propTypes,
  style: ViewPropTypes.style,
  image: PropTypes.shape({
    uri: PropTypes.string,
    path: PropTypes.string,
  }).isRequired,
};

export default FLSocialIcon;
