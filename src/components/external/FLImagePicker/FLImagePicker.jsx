// import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import {TouchableOpacity, Image} from 'react-native';
// import ImagePicker from 'react-native-image-picker';
// import FLToolbarIcon from 'components/external/FLToolbarIcon';
// import I18n from 'react-native-i18n';
// import toast from 'utils/toast';
// import styles from './styles';

// class FLImagePicker extends Component {
//   selectPhotoTapped = () => {
//     const {onChangeImage} = this.props;
//     const options = {
//       quality: 1.0,
//       maxWidth: 500,
//       maxHeight: 500,
//       storageOptions: {
//         skipBackup: true,
//       },
//     };

//     ImagePicker.showImagePicker(options, (response) => {
//       if (response.error) {
//         toast(I18n.t('IMAGE_PICKER_ERROR'));
//       } else if (!response.didCancel) {
//         const source = {uri: response.uri};
//         onChangeImage(source);
//       }
//     });
//   };

//   render() {
//     const {image, color, size, icon, type, style, onChangeImage} = this.props;
//     return (
//       <TouchableOpacity style={[styles.button, style]} onPress={() => this.selectPhotoTapped(onChangeImage)}>
//         {image ? (
//           <Image style={styles.image} source={image} resizeMode="cover" />
//         ) : (
//           <FLToolbarIcon icon={icon} type={type} color={color} size={size} />
//         )}
//       </TouchableOpacity>
//     );
//   }
// }
// FLImagePicker.propTypes = {
//   image: PropTypes.shape({
//     uri: PropTypes.string,
//     path: PropTypes.string,
//   }).isRequired,
//   onChangeImage: PropTypes.func.isRequired,
// };

// export default FLImagePicker;

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Image} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import FLToolbarIcon from 'components/external/FLToolbarIcon';
import I18n from 'react-native-i18n';
import toast from 'utils/toast';
import styles from './styles';
import {View, Button, Platform, Alert, Linking} from 'react-native';
import {check, request, PERMISSIONS, RESULTS, openSettings} from 'react-native-permissions';

class FLImagePicker extends Component {
  selectPhotoTapped = async () => {
    const {onChangeImage} = this.props;
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        toast(I18n.t('IMAGE_PICKER_ERROR'));
      } else {
        const source = {uri: response.assets[0].uri};
        onChangeImage(source);
      }
    });
  };

  render() {
    const {image, color, size, icon, type, style} = this.props;
    return (
      <TouchableOpacity style={[styles.button, style]} onPress={() => this.selectPhotoTapped()}>
        {image ? (
          <Image style={styles.image} source={image} resizeMode="cover" />
        ) : (
          <FLToolbarIcon icon={icon} type={type} color={color} size={size} />
        )}
      </TouchableOpacity>
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
  style: PropTypes.object,
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
