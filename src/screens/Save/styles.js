import {StyleSheet} from 'react-native';
import colors from 'config/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  imageText: {
    flex: 1,
    color: colors.DIVIDER,
    fontSize: 20,
  },
  image: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataPane: {
    flex: 3,
  },
  nameText: {
    flex: 1,
    color: colors.TEXT_SECONDARY,
    fontSize: 22,
    paddingTop: 5,
  },
  weightText: {
    flex: 1,
    color: colors.PRIMARY,
    fontSize: 28,
    height: 45,
  },
  dateText: {
    flex: 1,
    color: colors.DIVIDER,
    fontSize: 14,
  },
  editText: {
    flex: 2,
    color: 'black',
    padding: 0,
  },
  buttonPane: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
});
