import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  image: {
    flex: 1,
    backgroundColor: 'transparent',
    width: wp('100%'),
    height: hp('100%'),
  },
  imageCircle: {
    flex: 1,
    backgroundColor: 'transparent',
    width: hp('35%'),
    height: hp('35%'),
    maxWidth: hp('35%'),
    maxHeight: hp('35%'),
    borderRadius: hp('35%') / 2,
  },
});
