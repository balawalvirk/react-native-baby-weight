import {StyleSheet, Platform} from 'react-native';

export default StyleSheet.create({
  graphContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  graphContainerLandscape: {
    flexDirection: 'row',
  },
  graphPane: {
    flex: 0,
    width: '100%',
  },
  graphPaneLandscape: {
    flex: 3,
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
    width: '100%',
    backgroundColor: '#fff',
  },
  listPaneLandscape: {
    flex: 2,
    marginTop: 0,
    paddingLeft: 12,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: 16,
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
