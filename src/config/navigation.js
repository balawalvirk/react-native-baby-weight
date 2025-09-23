import React from 'react';
import FLToolbarButton from 'components/external/FLToolbarButton';
import FLHeaderTitle from 'components/external/FLHeaderTitle';
import I18n from 'react-native-i18n';
import CONSTANTS from './constants';
import colors from './colors';

const NAVIGATION_OPTIONS = {
  SCREEN_OPTIONS: {
    headerStyle: {
      backgroundColor: colors.PRIMARY,
    },
    headerTintColor: colors.TEXT_PRIMARY,
  },
  HOME: {
    headerTitle: () => <FLHeaderTitle title={I18n.t('HOME.APP_TITLE')} />,
    headerRight: () => (
      <>
        <FLToolbarButton icon={CONSTANTS.SCREEN_PROFILES_ICON} screen={CONSTANTS.SCREEN_PROFILES} />
        <FLToolbarButton icon={CONSTANTS.SCREEN_SETTINGS_ICON} screen={CONSTANTS.SCREEN_SETTINGS} />
      </>
    ),
  },
  EDIT_PROFILE: {
    headerTitle: () => <FLHeaderTitle title={I18n.t('EDIT_PROFILE.TITLE')} />,
    headerRight: () => (
      <>
        <FLToolbarButton icon={CONSTANTS.SCREEN_PROFILES_ICON} screen={CONSTANTS.SCREEN_PROFILES} />
        <FLToolbarButton icon={CONSTANTS.SCREEN_SETTINGS_ICON} screen={CONSTANTS.SCREEN_SETTINGS} />
      </>
    ),
  },
  PROFILES: {
    headerRight: () => <FLToolbarButton icon={CONSTANTS.SCREEN_SETTINGS_ICON} screen={CONSTANTS.SCREEN_SETTINGS} />,
    headerTitle: () => <FLHeaderTitle title={I18n.t('PROFILES.TITLE')} />,
  },
  SAVE: {
    headerTitle: () => <FLHeaderTitle title={I18n.t('SAVE.TITLE')} />,
  },
  GRAPH: {
    headerTitle: () => <FLHeaderTitle title={I18n.t('GRAPH.TITLE')} />,
    headerRight: () => <FLToolbarButton icon={CONSTANTS.SCREEN_SETTINGS_ICON} screen={CONSTANTS.SCREEN_SETTINGS} />,
  },
  SETTINGS: {
    headerTitle: () => <FLHeaderTitle title={I18n.t('SETTINGS.TITLE')} />,
  },
  PRIVACY_POLICY: {
    headerTitle: () => <FLHeaderTitle title={I18n.t('PRIVACY_POLICY.TITLE')} />,
  },
  LANGUAGE: {
    headerTitle: () => <FLHeaderTitle title={I18n.t('LANGUAGE.TITLE')} />,
  },
  SOCIAL_SHARE: {
    headerTitle: () => <FLHeaderTitle title={I18n.t('SHARE.TITLE')} />,
  },
  WEIGH: {
    headerTitle: () => <FLHeaderTitle title={I18n.t('WEIGH.TITLE')} middle={true} />,
    headerRight: () => (
      <>
        <FLToolbarButton icon={CONSTANTS.ICON_POWER_OFF} />
        <FLToolbarButton icon={CONSTANTS.SCREEN_PROFILES_ICON} screen={CONSTANTS.SCREEN_PROFILES} />

        <FLToolbarButton icon={CONSTANTS.SCREEN_SETTINGS_ICON} screen={CONSTANTS.SCREEN_SETTINGS} />
      </>
    ),
  },
};

export default NAVIGATION_OPTIONS;
