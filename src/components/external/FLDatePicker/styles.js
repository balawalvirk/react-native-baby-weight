import {StyleSheet} from 'react-native';
import colors from 'config/colors';
import constants from 'config/constants';

export default StyleSheet.create({
  dateInput: {
    borderWidth: 0,
    borderBottomColor: colors.PRIMARY,
    borderBottomWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: constants.FONT.MEDIUM,
    color: colors.PRIMARY,
    fontSize: 18,
  },
});
