import {StyleSheet} from 'react-native';
import colors from 'config/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.PRIMARY,
  },
  button: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
  },
  textSelected: {
    flex: 1,
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    color: colors.TEXT_PRIMARY,
    backgroundColor: colors.PRIMARY,
    textDecorationLine: 'underline',
  },
  text: {
    flex: 1,
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
    color: colors.TEXT_PRIMARY,
    backgroundColor: colors.PRIMARY,
  },
});
