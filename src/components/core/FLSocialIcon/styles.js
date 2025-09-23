import {StyleSheet} from 'react-native';
import colors from 'config/colors';

export default StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    backgroundColor: colors.BACKGROUND,
  },
  image: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
});
