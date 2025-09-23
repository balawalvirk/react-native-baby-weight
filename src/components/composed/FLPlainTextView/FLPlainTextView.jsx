import React from 'react';
import PropTypes from 'prop-types';
import FLContainer from 'components/core/FLContainer';
import FLText from 'components/core/FLText';
import styles from './styles';

const FLPlainTextView = ({text, style, textStyle}) => (
  <FLContainer style={[styles.container, style]}>
    <FLText style={[styles.text, textStyle]}>{text}</FLText>
  </FLContainer>
);

FLPlainTextView.propTypes = {
  text: PropTypes.string.isRequired,
};

export default FLPlainTextView;
