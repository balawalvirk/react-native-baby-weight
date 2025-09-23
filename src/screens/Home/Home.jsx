import React, {useCallback, useState} from 'react';
import I18n from 'react-native-i18n';
import CONSTANTS from 'config/constants';
import FLFancyButton from 'components/external/FLFancyButton';
import FLText from 'components/core/FLText';
import FLImage from 'components/core/FLImage';
import FLContainer from 'components/core/FLContainer';
import FLLoading from 'components/composed/FLLoading';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import retrieveUserData from 'utils/getUserData';
import makeStyles from './styles';
import {PERMISSIONS, RESULTS, check, openSettings, request, requestMultiple} from 'react-native-permissions';
import {Alert} from 'react-native';

const Home = () => {
  const [userData, setUserData] = useState();
  const navigation = useNavigation();
  const {navigate} = navigation;

  const retriveData = async () => {
    const currentUser = await retrieveUserData();
    if (currentUser === CONSTANTS.USER_NOT_FOUND) {
      return navigation.navigate(CONSTANTS.SCREEN_EDIT_PROFILE, {[CONSTANTS.SCREEN_EDIT_PROFILE_PARAM_NEW]: true});
    }
    setUserData(currentUser);
  };

  useFocusEffect(
    useCallback(() => {
      retriveData();
    }, []),
  );

  if (!userData) {
    return <FLLoading />;
  }

  const styles = makeStyles();
  const profileImage =
    userData.image === CONSTANTS.DEFAULT_PROFILE_PIC_KEY ? CONSTANTS.DEFAULT_PROFILE_PIC : userData.image;
  const requestPermissions = async () => {
    const requestPermissionWithAlert = (permission, title, message) => {
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

    const checkAndRequestPermission = async (permission, title, message) => {
      const status = await check(permission);
      if (status === RESULTS.GRANTED) {
        return RESULTS.GRANTED;
      } else {
        return await requestPermissionWithAlert(permission, title, message);
      }
    };

    try {
      const locationStatus = await checkAndRequestPermission(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        'Location Access Required',
        'MyBaby Weigh needs access to your location to find nearby Bluetooth devices for weighing, even when the app is closed or not in use.',
      );

      const bluetoothConnectStatus = await checkAndRequestPermission(
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        'Bluetooth Connection Required',
        'MyBaby Weigh needs access to Bluetooth to find and connect with nearby Bluetooth devices for accurate and convenient baby weighing.',
      );

      const bluetoothScanStatus = await checkAndRequestPermission(
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        'Bluetooth Scan Required',
        'MyBaby Weigh needs to scan for Bluetooth devices to ensure your Bluetooth-enabled scale is connected for accurate weighing.',
      );

      const isGranted =
        bluetoothConnectStatus === RESULTS.GRANTED &&
        bluetoothScanStatus === RESULTS.GRANTED &&
        locationStatus === RESULTS.GRANTED;

      console.log({isGranted});

      if (isGranted) {
        navigate(CONSTANTS.SCREEN_WEIGH);
      } else {
        Alert.alert(
          'Permissions Required',
          'Some permissions were not granted. Please enable them in the app settings.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => openSettings().catch(() => console.warn('Cannot open settings')),
            },
          ],
          {cancelable: false},
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <FLContainer style={styles.container}>
      <FLImage style={styles.image} image={profileImage} mode="cover" circle={true} />
      <FLText style={styles.text}>{userData.name}</FLText>
      <FLContainer style={styles.buttons}>
        <FLFancyButton
          style={styles.button}
          textStyle={styles.buttonText}
          gradientStyle={styles.buttonGradient}
          title={I18n.t('HOME.WEIGH')}
          iconL="scale-bathroom"
          iconTypeL="material-community"
          onPress={() => {
            requestPermissions();
          }}
        />
        <FLFancyButton
          style={styles.button}
          textStyle={styles.buttonText}
          gradientStyle={styles.buttonGradient}
          title={I18n.t('HOME.HISTORY')}
          iconL="trending-up"
          onPress={() => navigate(CONSTANTS.SCREEN_GRAPH)}
        />
        <FLFancyButton
          style={styles.button}
          textStyle={styles.buttonText}
          gradientStyle={styles.buttonGradient}
          title={I18n.t('HOME.EDIT')}
          iconL="account-edit"
          iconTypeL="material-community"
          onPress={() =>
            navigate(CONSTANTS.SCREEN_EDIT_PROFILE, {[CONSTANTS.SCREEN_EDIT_PROFILE_PARAM_EDIT]: userData.key})
          }
        />
      </FLContainer>
    </FLContainer>
  );
};

export default Home;
