import React from 'react';
import PropTypes from 'prop-types';
import {Image, ViewPropTypes} from 'react-native';
import styles from './styles';

const FLImage = ({image, mode, style, circle}) => {
  const imageStyle = circle ? styles.imageCircle : styles.image;
  return <Image style={[imageStyle, style]} source={image} resizeMode={mode} />;
};

FLImage.propTypes = {
  image: PropTypes.shape({
    uri: PropTypes.string,
    path: PropTypes.string,
  }).isRequired,
  mode: PropTypes.string,
  style: ViewPropTypes.style,
  circle: PropTypes.bool,
};

FLImage.defaultProps = {
  mode: 'contain',
  circle: false,
};

export default FLImage;
