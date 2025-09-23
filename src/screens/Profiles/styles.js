import {Dimensions, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import constants from 'config/constants';
import colors from 'config/colors';

const makeStyles = () => {
  const {width, height} = Dimensions.get('window');
  const portrait = height > width;

  return StyleSheet.create({
    container: {
      width: portrait ? wp('100%') : wp('75%'),
      flexGrow: 1,
    },
    text: {
      flex: 0,
      padding: hp('5%'),
      color: colors.TEXT_SECONDARY,
      fontSize: portrait ? hp('3%') : hp('5%'),
      fontFamily: constants.FONT.MEDIUM,
    },
  });
};

export default makeStyles;
