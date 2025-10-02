import {StyleSheet, Platform} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from 'config/colors';

export default StyleSheet.create({
  container: {
    justifyContent: 'space-around',
  },
  text: {
    flex: 1,
    color: colors.DIVIDER,
    maxHeight: hp('5%'),
    fontSize: hp('3%'),
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: hp('45%'),
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  editText: {
    flex: 1,
    maxHeight: hp('10%'),
    width: wp('70%'),
    color: colors.PRIMARY,
    borderBottomWidth: 1,
  },
  editGoalText: {
    height: 45,
    maxHeight: 45,
    color: colors.PRIMARY,
    borderBottomWidth: 0,
    textAlign: 'right',
  },
  picker: {
    flex: 1,
    maxHeight: 40,
    width: wp('70%'),
  },
  radio: {
    flex: 1,
    maxHeight: hp('10%'),
  },
  buttonPane: {
    flex: 1,
    maxHeight: hp('10%'),
  },
  editGoalContainer: {
    flexDirection: 'row',
    width: wp('70%'),
    justifyContent: 'center',
    borderBottomColor: colors.PRIMARY,
    borderBottomWidth: 1,
  },
});
