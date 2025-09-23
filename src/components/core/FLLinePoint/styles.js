import {StyleSheet} from 'react-native';
import colors from 'config/colors';

export default StyleSheet.create({
  root: {
    padding: 20,
    borderTopWidth: 2,
    borderColor: colors.PRIMARY_DARK,
    position: 'relative',
    margin: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    width: '100%',
  },
  last: {
    borderBottomWidth: 2,
  },
  viev: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: colors.PRIMARY_DARK,
  },
});
