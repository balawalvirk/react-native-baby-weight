import React, {useCallback, useState, useRef} from 'react';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {Dimensions, Platform} from 'react-native';
import ViewShot from 'react-native-view-shot';
import Svg, {Circle, Text, Rect, Image, Defs, ClipPath} from 'react-native-svg';
import Share from 'react-native-share';
import I18n from 'react-native-i18n';
import retrieveUserData from 'utils/getUserData';
import {format, weightFormat} from 'utils';
import CONSTANTS from 'config/constants';
import COLORS from 'config/colors';
import FLFancyButton from 'components/external/FLFancyButton';
import FLLoading from 'components/composed/FLLoading';
import FLContainer from 'components/core/FLContainer';
import styles from './styles';

const {width, height} = Dimensions.get('window');

const SocialShare = () => {
  const route = useRoute();
  const [userData, setUserData] = useState();
  const [data, setData] = useState();
  const viewShot = useRef();

  const retrieveData = async () => {
    const user = await retrieveUserData();
    setUserData(user);
  };

  const retrieveShareData = () => {
    const shareData = route.params?.[CONSTANTS.SCREEN_SHARE_PARAM_DATA];
    setData(shareData);
  };

  useFocusEffect(
    useCallback(() => {
      retrieveData();
      retrieveShareData();
    }, []),
  );

  const handleSharedClick = () => {
    viewShot.current.capture().then((uri) => {
      if (uri) {
        const url = Platform.OS === 'ios' ? `file://${uri}` : uri;
        const shareOptions = {
          title: I18n.t('HOME.APP_TITLE'),
          type: 'image/jpg',
          url,
        };
        Share.open(shareOptions);
      }
    });
  };

  if (!userData) {
    return <FLLoading />;
  }

  const profileImage = userData.image || CONSTANTS.DEFAULT_PROFILE_PIC;

  const dataImage = data.image || CONSTANTS.DEFAULT_PROFILE_PIC;

  const weight = weightFormat.recountWeight({
    unit: userData.selectedUnit,
    weight: data.weight,
  });

  return (
    <FLContainer style={styles.container}>
      <ViewShot ref={viewShot} options={{format: 'jpg', quality: 0.9}}>
        <Svg height={height * 0.6} width={width * 0.8} style={styles.shareContainer} ref={viewShot}>
          <Defs>
            <ClipPath id="profile_image">
              <Circle cx="15%" cy="25%" r="8%" />
            </ClipPath>
            <ClipPath id="data_image">
              <Circle cx="50%" cy="62%" r="30%" />
            </ClipPath>
          </Defs>
          <Rect x="0%" y="0%" width="100%" height="15%" fill={COLORS.PRIMARY} />
          <Text
            x="50%"
            y="10%"
            fill={COLORS.TEXT_PRIMARY}
            fontSize="20"
            fontFamily={CONSTANTS.FONT.MEDIUM}
            textAnchor="middle">
            {I18n.t('HOME.APP_TITLE')}
          </Text>
          <Image
            x="5%"
            y="15%"
            width="20%"
            height="20%"
            preserveAspectRatio="xMidYMid slice"
            xlinkHref={profileImage}
            clipPath="url(#profile_image)"
          />
          <Text x="30%" y="25%" fill={COLORS.PRIMARY} fontSize="12" fontFamily={CONSTANTS.FONT.BOLD}>
            {userData.name}
          </Text>
          <Text x="60%" y="21%" fill={COLORS.PRIMARY} fontSize="12" fontFamily={CONSTANTS.FONT.BOLD}>
            {I18n.t('SHARE.DATE', {date: format.displayDate(data.date)})}
          </Text>
          <Text x="60%" y="25%" fill={COLORS.PRIMARY} fontSize="12" fontFamily={CONSTANTS.FONT.BOLD}>
            {I18n.t('SHARE.TIME', {time: format.displayTime(data.date)})}
          </Text>
          <Text x="60%" y="29%" fill={COLORS.PRIMARY} fontSize="12" fontFamily={CONSTANTS.FONT.BOLD}>
            {I18n.t('SHARE.WEIGHT', {weight})}
          </Text>
          <Image
            x="0%"
            y="25%"
            width="100%"
            height="70%"
            preserveAspectRatio="xMidYMid meet"
            xlinkHref={dataImage}
            clipPath="url(#data_image)"
          />
          <Text
            x="50%"
            y="95%"
            fill={COLORS.PRIMARY}
            fontSize="12"
            fontFamily={CONSTANTS.FONT.BOLD}
            textAnchor="middle">
            {CONSTANTS.MY_WEIGH_URL}
          </Text>
          <Rect x="0%" y="0%" width="100%" height="100%" stroke="black" strokeWidth="3" fill="transparent" />
        </Svg>
      </ViewShot>
      <FLContainer style={styles.buttonPane}>
        <FLFancyButton
          title={I18n.t('SHARE.TITLE')}
          iconL="share"
          iconTypeL="material-community"
          onPress={handleSharedClick}
        />
      </FLContainer>
    </FLContainer>
  );
};

export default SocialShare;
