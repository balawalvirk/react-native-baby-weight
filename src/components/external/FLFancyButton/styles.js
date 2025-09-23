import {Dimensions, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from 'config/colors';
import constants from 'config/constants';

const {width, height} = Dimensions.get('window');
const portrait = height > width;

export const gradientStart = colors.BUTTON_START;
export const gradientEnd = colors.BUTTON_END;
export const defaultSize = portrait ? hp('5%') : wp('5%');
export const defaultColor = colors.ICONS;

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  button: {
    flex: 0,
    width: portrait ? wp('80%') : wp('30%'),
    height: portrait ? hp('7.5%') : hp('15%'),
    backgroundColor: 'transparent',
  },
  text: {
    flex: 2,
    fontSize: portrait ? hp('3%') : wp('3%'),
    letterSpacing: portrait ? wp('0.5%') : wp('0.25%'),
    fontFamily: constants.FONT.MEDIUM,
    textAlign: 'center',
    color: colors.TEXT_PRIMARY,
    backgroundColor: 'transparent',
  },
  icon: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingLeft: portrait ? wp('5%') : wp('2.5%'),
    paddingRight: portrait ? wp('5%') : wp('2.5%'),
    borderRadius: hp('2.5%'),
  },
});
