import {StyleSheet, Dimensions} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import constants from 'config/constants';
import colors from 'config/colors';

const makeStyles = () => {
  const {width, height} = Dimensions.get('window');
  const portrait = height > width;

  return StyleSheet.create({
    container: {
      justifyContent: 'space-around',
    },
    image: {
      flex: portrait ? 7 : 3,
      marginTop: hp('2.5%'),
      width: hp('35%'),
      height: hp('35%'),
      maxWidth: hp('35%'),
      maxHeight: hp('35%'),
      borderRadius: hp('35%') / 2,
    },
    text: {
      flex: portrait ? 2 : 1,
      color: colors.PRIMARY,
      fontSize: portrait ? hp('3%') : hp('5%'),
      fontFamily: constants.FONT.BOLD,
    },
    buttons: {
      flex: portrait ? 6 : 2,
      justifyContent: 'space-around',
      flexDirection: portrait ? 'column' : 'row',
    },
    button: {
      width: portrait ? wp('80%') : wp('30%'),
      height: portrait ? hp('7.5%') : hp('15%'),
    },
    buttonText: {
      fontSize: portrait ? hp('2.4%') : wp('2.4%'),
      letterSpacing: portrait ? wp('0.5%') : wp('0.25%'),
    },
    buttonGradient: {
      paddingLeft: portrait ? wp('5%') : wp('2.5%'),
      paddingRight: portrait ? wp('5%') : wp('2.5%'),
    },
  });
};

export default makeStyles;
