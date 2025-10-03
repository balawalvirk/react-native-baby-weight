import {Dimensions, StyleSheet} from 'react-native';
import colors from 'config/colors';

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
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    height: height * 0.4,
    backgroundColor: colors.BACKGROUND,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    // paddingTop: 10,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.DIVIDER,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.TEXT_SECONDARY,
    fontFamily: 'Quicksand-Medium',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  optionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'transparent',
    minWidth: 100,
    marginHorizontal: 10,
  },
  optionText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: colors.PRIMARY,
    fontFamily: 'Quicksand-Medium',
  },
});
