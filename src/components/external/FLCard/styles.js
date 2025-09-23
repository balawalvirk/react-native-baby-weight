import {Dimensions, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from 'config/colors';

const {width, height} = Dimensions.get('window');
const portrait = height > width;

export const iconColor = colors.TEXT_SECONDARY;
export const iconSize = portrait ? hp('4%') : wp('4%');
const imageSize = '10%';

export default StyleSheet.create({
  container: {
    flex: 0,
    margin: portrait ? hp('2.5%') : wp('2.5%'),
    padding: portrait ? hp('2.5%') : wp('2.5%'),
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: portrait ? wp('90%') : hp('90%'),
    height: portrait ? hp('15%') : wp('15%'),
    elevation: 5,
  },
  image: {
    flex: 3,
    backgroundColor: 'transparent',
    width: portrait ? hp(imageSize) : wp(imageSize),
    height: portrait ? hp(imageSize) : wp(imageSize),
    maxWidth: portrait ? hp(imageSize) : wp(imageSize),
    maxHeight: portrait ? hp(imageSize) : wp(imageSize),
    borderRadius: portrait ? hp(imageSize) / 2 : wp(imageSize) / 2,
    alignSelf: 'center',
  },
  textView: {
    flexDirection: 'column',
    flex: 1,
  },
  text: {
    flex: 7,
    paddingLeft: portrait ? hp('2.5%') : wp('2.5%'),
    fontSize: portrait ? hp('2.5%') : wp('2.5%'),
    textAlign: 'left',
    color: colors.TEXT_SECONDARY,
    alignSelf: 'flex-start',
  },
  icon: {
    flex: 1,
  },
});
