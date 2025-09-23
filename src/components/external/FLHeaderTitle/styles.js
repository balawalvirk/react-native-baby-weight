import {StyleSheet} from 'react-native';
import CONSTANTS from 'config/constants';
import colors from 'config/colors';

export default StyleSheet.create({
  headerText: {
    fontFamily: CONSTANTS.APP_TITLE_FONT,
    fontSize: CONSTANTS.APP_TITLE_FONT_SIZE,
    fontWeight: 'normal',
    color: colors.TEXT_PRIMARY,
  },
  center: {
    flex: 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
