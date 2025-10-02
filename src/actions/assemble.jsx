import React from 'react';
import {View, Picker} from 'react-native';
import FLCard from 'components/external/FLCard';
import FLContainer from 'components/core/FLContainer';
import FLSocialIcon from 'components/core/FLSocialIcon';
import colors from 'config/colors';
import constants from 'config/constants';
import Share from 'react-native-share';
import {
  shareFacebookUri,
  shareTwitterUri,
  shareInstagramUri,
  shareSnapchatUri,
  shareWhatsappUri,
  shareGooglePlusUri,
  shareGmailUri,
  shareOutlookUri,
} from 'assets/icons';
import styles from './styles';

export const makeProfileCards = (users, buttonClick, iconClick) => {
  const items = users.map((user) => {
    const displayImage = user.image === constants.DEFAULT_PROFILE_PIC_KEY ? constants.DEFAULT_PROFILE_PIC : user.image;
    
    // Get the latest weight from user data
    const latestWeight = user.data && user.data.length > 0 
      ? user.data[user.data.length - 1].weight 
      : null;
    
    const item = (
      <FLCard
        key={user.key}
        image={displayImage}
        text={user.name}
        dateOfBirth={user.dob}
        weight={latestWeight}
        selectedUnit={user.selectedUnit}
        buttonClick={() => buttonClick(user.key)}
        iconClick={() => iconClick(user.name, user.key)}
      />
    );
    return item;
  });
  const buffer = <View key="buffer_key" style={styles.buffer} />;
  items.push(buffer);
  return items;
};

export const makeUnitsPicker = () => {
  const items = [
    <Picker.Item
      key={constants.SETTINGS.PREFERRED_UNITS_METRIC_KEY}
      label={constants.SETTINGS.PREFERRED_UNITS_METRIC_LABEL}
      value={constants.SETTINGS.PREFERRED_UNITS_METRIC_KEY}
      color={colors.TEXT_SECONDARY}
    />,
    <Picker.Item
      key={constants.SETTINGS.PREFERRED_UNITS_IMPERIAL_KEY}
      label={constants.SETTINGS.PREFERRED_UNITS_IMPERIAL_LABEL}
      value={constants.SETTINGS.PREFERRED_UNITS_IMPERIAL_KEY}
      color={colors.TEXT_SECONDARY}
    />,
  ];
  return items;
};

export const generateSocialIcons = (shareTo) => {
  const socialIcons = [
    <FLContainer style={styles.listViewItems} key="facebook">
      <FLSocialIcon image={{uri: shareFacebookUri}} onPress={() => shareTo(Share.Social.FACEBOOK)} />
    </FLContainer>,
    <FLContainer style={styles.listViewItems} key="twitter">
      <FLSocialIcon image={{uri: shareTwitterUri}} />
    </FLContainer>,
    <FLContainer style={styles.listViewItems} key="instagram">
      <FLSocialIcon image={{uri: shareInstagramUri}} onPress={() => shareTo(Share.Social.INSTAGRAM)} />
    </FLContainer>,
    <FLContainer style={styles.listViewItems} key="snapchat">
      <FLSocialIcon image={{uri: shareSnapchatUri}} />
    </FLContainer>,
    <FLContainer style={styles.listViewItems} key="whatsapp">
      <FLSocialIcon image={{uri: shareWhatsappUri}} onPress={() => shareTo(Share.Social.WHATSAPP)} />
    </FLContainer>,
    <FLContainer style={styles.listViewItems} key="google_plus">
      <FLSocialIcon image={{uri: shareGooglePlusUri}} onPress={() => shareTo(Share.Social.GOOGLEPLUS)} />
    </FLContainer>,
    <FLContainer style={styles.listViewItems} key="gmail">
      <FLSocialIcon image={{uri: shareGmailUri}} onPress={() => shareTo(Share.Social.EMAIL)} />
    </FLContainer>,
    <FLContainer style={styles.listViewItems} key="outlook">
      <FLSocialIcon image={{uri: shareOutlookUri}} onPress={() => shareTo(Share.Social.EMAIL)} />
    </FLContainer>,
  ];

  return socialIcons;
};
