import {Dimensions, StyleSheet, Platform} from 'react-native';
import colors from 'config/colors';

export const {width, height} = Dimensions.get('window');
export const font = 'Quicksand-Regular';
export const victoryLine = {
  zIndex: 100000,
  data: {stroke: '#c43a31'},
  parent: {border: '1px solid #ccc'},
};

export default StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
    maxHeight: Platform.select({
      android: height / 2,
      ios: 320,
    }),
    backgroundColor: colors.LIGHT,
  },
  chartContainer: {
    flex: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.LIGHT,
  },
  graphSvg: {
    marginLeft: -30,
  },
  emptyView: {
    marginTop: 10,
  },
});
