import {StyleSheet, Platform} from 'react-native';
import colors from 'config/colors';
import constants from 'config/constants';

export default StyleSheet.create({
  unitsText: {
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: constants.FONT.MEDIUM,
    color: colors.PRIMARY,
    height: 45,
    maxHeight: 45,
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: Platform.select({
      android: 5,
      ios: 10,
    }),
  },
});
