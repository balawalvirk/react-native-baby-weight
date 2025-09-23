import {StyleSheet} from 'react-native';
import colors from 'config/colors';

export default StyleSheet.create({
  default: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.BACKGROUND,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  },
  scrollView: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.BACKGROUND,
  },
});
