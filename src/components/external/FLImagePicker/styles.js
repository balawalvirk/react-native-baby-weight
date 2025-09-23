import {Dimensions, StyleSheet} from 'react-native';

const {height} = Dimensions.get('window');

export default StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  image: {
    flex: 1,
    backgroundColor: 'transparent',
    width: height * 0.35,
    height: height * 0.35,
    maxWidth: height * 0.35,
    maxHeight: height * 0.35,
    borderRadius: (height * 0.35) / 2,
  },
});
