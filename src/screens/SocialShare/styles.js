import {StyleSheet} from 'react-native';
import colors from 'config/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  shareContainer: {
    backgroundColor: colors.BACKGROUND,
  },
  listview: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxHeight: '25%',
  },
  buttonPane: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
});
