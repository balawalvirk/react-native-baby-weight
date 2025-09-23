import {StyleSheet} from 'react-native';
import colors from 'config/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  image: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dataPane: {
    flex: 3,
  },
  nameText: {
    flex: 0,
    color: colors.TEXT_SECONDARY,
    fontSize: 22,
    margin: 0,
    paddingBottom: 5,
  },
  weightText: {
    flex: 0,
    color: colors.PRIMARY,
    fontSize: 32,
  },
  dateText: {
    flex: 0,
    color: colors.DIVIDER,
    fontSize: 16,
    margin: 0,
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
