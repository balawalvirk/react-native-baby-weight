import {StyleSheet} from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  toolbarIcons: {
    flexDirection: 'row',
    backgroundColor: colors.PRIMARY,
  },
  textPadding: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});
