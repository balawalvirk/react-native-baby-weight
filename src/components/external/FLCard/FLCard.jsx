import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import FLImage from 'components/core/FLImage';
import FLContainer from 'components/core/FLContainer';
import FLText from 'components/core/FLText';
import styles, {iconColor, iconSize} from './styles';

const FLCard = ({image, text, dateOfBirth = '', buttonClick, iconClick}) => (
  <TouchableOpacity onPress={buttonClick}>
    <FLContainer style={styles.container}>
      <FLImage image={image} style={styles.image} mode="cover" />
      <View style={styles.textView}>
        <FLText style={styles.text}>{text}</FLText>
        <FLText style={styles.text}>{dateOfBirth}</FLText>
      </View>
      <Icon style={styles.icon} name="more-vert" color={iconColor} size={iconSize} onPress={iconClick} />
    </FLContainer>
  </TouchableOpacity>
);

FLCard.propTypes = {
  image: PropTypes.shape({
    uri: PropTypes.string,
    path: PropTypes.string,
  }).isRequired,
  text: PropTypes.string.isRequired,
  buttonClick: PropTypes.func.isRequired,
  iconClick: PropTypes.func.isRequired,
};

export default FLCard;
