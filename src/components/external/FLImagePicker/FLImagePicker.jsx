import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Image, Text, View} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import FLToolbarIcon from 'components/external/FLToolbarIcon';
import FLFancyButton from 'components/external/FLFancyButton';
import I18n from 'react-native-i18n';
import toast from 'utils/toast';
import colors from 'config/colors';
import styles from './styles';

class FLImagePicker extends Component {
  state = {
    isModalVisible: false,
  };

  toggleModal = () => {
    this.setState((prevState) => ({isModalVisible: !prevState.isModalVisible}));
  };

  selectPhotoTapped = async () => {
    const {onChangeImage} = this.props;
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 1,
    };
    // Close modal immediately when gallery opens
    this.toggleModal();
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        // User cancelled image picker
      } else if (response.errorMessage) {
        toast(I18n.t('IMAGE_PICKER_ERROR'));
      } else {
        const source = {uri: response.assets[0].uri};
        onChangeImage(source);
      }
    });
  };

  launchCamera = () => {
    const {onChangeImage} = this.props;
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 1,
    };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        // User cancelled image picker
      } else if (response.errorMessage) {
        toast(I18n.t('IMAGE_PICKER_ERROR'));
      } else {
        const source = {uri: response.assets[0].uri};
        onChangeImage(source);
      }
      // Close modal after response (whether cancelled, error, or success)
      this.toggleModal();
    });
  };

  render() {
    const {image, color, size, icon, type, style} = this.props;
    const {isModalVisible} = this.state;

    return (
      <>
        <TouchableOpacity style={[styles.button, style]} onPress={this.toggleModal}>
          {image ? (
            <Image style={styles.image} source={image} resizeMode="cover" />
          ) : (
            <FLToolbarIcon icon={icon} type={type} color={color} size={size} />
          )}
        </TouchableOpacity>

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={this.toggleModal}
          onBackButtonPress={this.toggleModal}
          style={styles.modal}
          backdropOpacity={0.5}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={300}
          animationOutTiming={300}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Image Source</Text>
              </View>

              <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optionButton} onPress={this.selectPhotoTapped}>
                  <FLToolbarIcon icon="photo-library" type="material" color={colors.PRIMARY} size={30} />
                  <Text style={styles.optionText}>Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={this.launchCamera}>
                  <FLToolbarIcon icon="camera-alt" type="material" color={colors.PRIMARY} size={30} />
                  <Text style={styles.optionText}>Camera</Text>
                </TouchableOpacity>
              </View>

              <FLFancyButton title="Cancel" onPress={this.toggleModal} />
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

FLImagePicker.propTypes = {
  image: PropTypes.shape({
    uri: PropTypes.string,
    path: PropTypes.string,
  }),
  onChangeImage: PropTypes.func.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  icon: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.shape({}),
};

FLImagePicker.defaultProps = {
  image: null,
  color: '#000',
  size: 24,
  icon: 'camera',
  type: 'material',
  style: {},
};

export default FLImagePicker;
