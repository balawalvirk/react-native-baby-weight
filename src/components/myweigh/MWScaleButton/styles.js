import {Dimensions, StyleSheet} from 'react-native';
import colors from 'config/colors';

const {width, height} = Dimensions.get('window');
export const iconSize = 35;
export const iconColor = colors.PRIMARY;
const font = 'Quicksand-Medium';

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.BACKGROUND,
  },
  button: {
    flex: 0,
    width: width * 0.3,
    height: height * 0.1,
    backgroundColor: colors.BACKGROUND,
  },
  text: {
    flex: 1,
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: font,
    textAlign: 'center',
    color: colors.PRIMARY,
    backgroundColor: colors.BACKGROUND,
  },
  icon: {
    flex: 1,
  },
});
