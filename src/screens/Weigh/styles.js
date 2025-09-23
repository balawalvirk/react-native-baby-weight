import {StyleSheet} from 'react-native';
import colors from 'config/colors';
import constants from 'config/constants';

export default StyleSheet.create({
  displayPane: {
    flex: 7,
    justifyContent: 'space-around',
    maxHeight: '75%',
    backgroundColor: colors.PRIMARY,
  },
  functionPane: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    maxHeight: '15%',
    backgroundColor: colors.BACKGROUND,
    paddingTop: 28,
  },
  buttonPane: {
    flex: 4,
    justifyContent: 'flex-end',
    maxHeight: '18%',
    backgroundColor: colors.BACKGROUND,
    paddingBottom: 30,
  },
  modePane: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.PRIMARY,
  },
  weightPane: {
    flex: 4,
    justifyContent: 'space-around',
    backgroundColor: colors.PRIMARY,
  },
  errorText: {
    color: colors.ICONS,
    fontSize: 16,
    fontFamily: constants.FONT.MEDIUM,
  },
  weightText: {
    color: colors.ICONS,
    fontSize: 50,
    fontFamily: constants.FONT.MEDIUM,
  },
  weightText2: {
    color: colors.ICONS,
    fontSize: 20,
    fontFamily: constants.FONT.MEDIUM,
  },
});
