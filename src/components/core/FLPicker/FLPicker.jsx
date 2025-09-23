import React, {useRef} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import ReactNativePickerModule from 'react-native-picker-module';
import PropTypes from 'prop-types';
import colors from 'config/colors';
import styles from './styles';

const FLPicker = ({onValueChange, pickerItems, value}) => {
  const pickerRef = useRef();

  return (
    <>
      <TouchableOpacity onPress={() => pickerRef.current.show()}>
        <Text style={styles.unitsText}>{value}</Text>
      </TouchableOpacity>
      <ReactNativePickerModule
        pickerRef={pickerRef}
        value={value}
        items={pickerItems}
        selectedColor={colors.PRIMARY}
        onValueChange={onValueChange}
      />
    </>
  );
};

FLPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
  pickerItems: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
};

export default FLPicker;
