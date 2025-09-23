import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, ViewPropTypes, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import FLText from 'components/core/FLText';
import FLContainer from 'components/core/FLContainer';
import styles, {gradientStart, gradientEnd, defaultColor, defaultSize} from './styles';

const FLFancyButton = ({
  title,
  style,
  textStyle,
  gradientStyle,
  iconL,
  iconTypeL,
  iconColorL,
  iconSizeL,
  iconR,
  iconTypeR,
  iconColorR,
  iconSizeR,
  ...buttonProps
}) => {
  const iconLX = iconL || 'warning';
  const iconRX = iconR || 'warning';
  const iconColorLx = iconL ? iconColorL : 'transparent';
  const iconColorRx = iconR ? iconColorR : 'transparent';
  return (
    <TouchableOpacity {...buttonProps} style={[styles.button, style]}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[gradientStart, gradientEnd]}
        style={[styles.gradient, gradientStyle]}>
        <FLContainer style={styles.container}>
          <Icon name={iconLX} type={iconTypeL} color={iconColorLx} size={iconSizeL} />
          <FLText style={[styles.text, textStyle]}>{title}</FLText>
          <Icon name={iconRX} type={iconTypeR} color={iconColorRx} size={iconSizeR} />
        </FLContainer>
      </LinearGradient>
    </TouchableOpacity>
  );
};

FLFancyButton.propTypes = {
  ...TouchableOpacity.propTypes,
  title: PropTypes.string,
  iconL: PropTypes.string,
  iconTypeL: PropTypes.string,
  iconColorL: PropTypes.string,
  iconSizeL: PropTypes.number,
  iconR: PropTypes.string,
  iconTypeR: PropTypes.string,
  iconColorR: PropTypes.string,
  iconSizeR: PropTypes.number,
  style: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  gradientStyle: ViewPropTypes.style,
};

FLFancyButton.defaultProps = {
  iconTypeL: 'material',
  iconColorL: defaultColor,
  iconSizeL: defaultSize,
  iconTypeR: 'material',
  iconColorR: defaultColor,
  iconSizeR: defaultSize,
};

export default FLFancyButton;
