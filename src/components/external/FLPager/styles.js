import {StyleSheet, Platform} from 'react-native';
import colors from 'config/colors';

export const defaultSize = 50;
export const defaultColor = '#ccc';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: Platform.select({
      android: 10,
      ios: 0,
    }),
    marginBottom: Platform.select({
      android: 3,
      ios: 0,
    }),
    height: 50,
  },
  text: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Quicksand-Regular',
    color: colors.PRIMARY,
    paddingBottom: 0,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    lineHeight: 45,
  },
});
