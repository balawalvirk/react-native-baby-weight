import {StyleSheet, Dimensions, Platform} from 'react-native';

const DEVICE_HEIGHT = Dimensions.get('screen').height;

export default StyleSheet.create({
  graphContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  graphChoosePointView: {
    maxHeight: 60,
    justifyContent: 'center',
    paddingVertical: 6,
  },
  graphChoosePointText: {
    lineHeight: 40,
  },
  scrollViewContainer: {
    marginTop: Platform.select({
      android: 20,
      ios: 0,
    }),
    flex: 1,
    maxHeight: DEVICE_HEIGHT / 2,
  },
  scrollView: {
    flex: 1,
  },
  goalTextView: {
    maxHeight: 35,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  goalText: {
    lineHeight: 35,
    textAlign: 'left',
    fontSize: 20,
  },
});
