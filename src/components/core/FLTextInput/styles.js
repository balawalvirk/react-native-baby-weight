import {StyleSheet} from 'react-native';
import colors from 'config/colors';

export const accent = colors.PRIMARY;

export default StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.TEXT_PRIMARY,
    borderBottomColor: colors.PRIMARY,
  },
});
