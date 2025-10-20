import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Image, Text, View, Alert, Platform} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import FLToolbarIcon from 'components/external/FLToolbarIcon';
import FLFancyButton from 'components/external/FLFancyButton';
import I18n from 'react-native-i18n';
import toast from 'utils/toast';
import colors from 'config/colors';
import {PERMISSIONS, RESULTS, check, request, openSettings} from 'react-native-permissions';
import styles from './styles';

class FLImagePicker extends Component {
  state = {
    isModalVisible: false,
  };

  toggleModal = () => {
    this.setState((prevState) => ({isModalVisible: !prevState.isModalVisible}));
  };

  requestPermissionWithAlert = (permission, title, message) => {
    return new Promise((resolve) => {
      Alert.alert(
        title,
        message,
        [
          {
            text: 'OK',
            onPress: async () => {
              const status = await request(permission);
              resolve(status);
            },
          },
        ],
        {cancelable: false},
      );
    });
  };

  checkAndRequestPermission = async (permission, title, message) => {
    const status = await check(permission);
    if (status === RESULTS.GRANTED) {
      return RESULTS.GRANTED;
    }
    return await this.requestPermissionWithAlert(permission, title, message);
  };

  getGalleryPermission = () => {
    if (Platform.OS === 'android') {
      // Android 13+ uses READ_MEDIA_IMAGES, older versions use READ_EXTERNAL_STORAGE
      return Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    }
    return PERMISSIONS.IOS.PHOTO_LIBRARY;
  };

  getCameraPermission = () => {
    return Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA;
  };

  selectPhotoTapped = async () => {
    const {onChangeImage} = this.props;
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 1,
    };
    const permission = this.getGalleryPermission();
    const status = await this.checkAndRequestPermission(
      permission,
      'Photo Access Required',
      'MyBaby Weigh needs access to your photos to select an image.',
    );

    if (status === RESULTS.GRANTED) {
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
    } else {
      // Close modal and prompt user to open Settings
      if (this.state.isModalVisible) {
        this.toggleModal();
      }
      Alert.alert(
        'Permission Required',
        'Please enable photo library access in the app settings.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => openSettings().catch(() => console.warn('Cannot open settings'))},
        ],
        {cancelable: true},
      );
    }
  };

  launchCamera = async () => {
    const {onChangeImage} = this.props;
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 1,
    };

    // Check permission status
    const permission = this.getCameraPermission();
    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      // Permission granted, launch camera
      this.toggleModal();
      launchCamera(options, (response) => {
        if (response.didCancel) {
          // User cancelled image picker
        } else if (response.errorMessage) {
          toast(I18n.t('IMAGE_PICKER_ERROR'));
        } else {
          const source = {uri: response.assets[0].uri};
          onChangeImage(source);
        }
      });
    } else if (status === RESULTS.DENIED) {
      // Permission denied, request it
      const requestStatus = await request(permission);
      if (requestStatus === RESULTS.GRANTED) {
        // Permission granted after request, launch camera
        this.toggleModal();
        launchCamera(options, (response) => {
          if (response.didCancel) {
            // User cancelled image picker
          } else if (response.errorMessage) {
            toast(I18n.t('IMAGE_PICKER_ERROR'));
          } else {
            const source = {uri: response.assets[0].uri};
            onChangeImage(source);
          }
        });
      } else {
        // Permission denied, show alert and open settings directly
        this.toggleModal();
        Alert.alert(
          'Camera Access Required',
          'MyBaby Weigh needs access to your camera to take a photo.',
          [
            {
              text: 'Open Settings',
              onPress: () => openSettings().catch(() => console.warn('Cannot open settings')),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
          {cancelable: true},
        );
      }
    } else {
      // Blocked or unavailable, open settings directly
      this.toggleModal();
      Alert.alert(
        'Camera Access Required',
        'Please enable camera access in your settings.',
        [
          {
            text: 'Open Settings',
            onPress: () => openSettings().catch(() => console.warn('Cannot open settings')),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    }
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
