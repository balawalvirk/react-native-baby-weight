import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Text, TouchableOpacity, ViewPropTypes} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import constants from 'config/constants';
import {dateFormat} from 'utils/getDateFormat';
import styles from './styles';

const FLDatePicker = ({initialDate, onDateChange, style}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisible = () => setIsVisible((prevVisible) => !prevVisible);

  const handleConfirm = (date) => {
    toggleVisible();
    onDateChange(moment(date).format(dateFormat(constants.LOCALE)));
  };

  return (
    <>
      <TouchableOpacity onPress={toggleVisible} style={[styles.dateInput, style]}>
        <Text style={styles.dateText}>{initialDate}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isVisible}
        date={new Date(moment(initialDate, dateFormat(constants.LOCALE)))}
        maximumDate={new Date()}
        mode="date"
        locale={constants.LOCALE}
        onConfirm={handleConfirm}
        onCancel={toggleVisible}
      />
    </>
  );
};

FLDatePicker.propTypes = {
  style: ViewPropTypes.style,
  initialDate: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,
};

FLDatePicker.defaultProps = {
  initialDate: -1,
};

export default FLDatePicker;
