import {Dimensions, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import constants from 'config/constants';
import colors from 'config/colors';

const {width, height} = Dimensions.get('window');
const portrait = height > width;

export default StyleSheet.create({
  text: {
    flex: 1,
    fontSize: portrait ? hp('5%') : hp('10%'),
    fontFamily: constants.FONT.NORMAL,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.TEXT_PRIMARY,
  },
});
