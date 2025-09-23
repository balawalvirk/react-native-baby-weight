import {Platform, NativeModules} from 'react-native';
import {icNewProfilePicUri} from 'assets/icons';

export default {
  APP_KEY: 'MyWeighBaby',
  APP_TITLE: 'My Weigh Baby',
  APP_TITLE_FONT: 'Quicksand-Regular',
  APP_TITLE_FONT_SIZE: 20,

  DEVICE_NAME: 'CC41-A',
  SERVICE_UUID: '0000ffe0-0000-1000-8000-00805f9b34fb',
  CHARACTERISTIC_UUID: '0000ffe1-0000-1000-8000-00805f9b34fb',

  MAX_USERS: 6,
  DEFAULT_PROFILE_NAME: 'Name',
  DEFAULT_PROFILE_PIC_KEY: '@MW_default_profile_pic_key',
  DEFAULT_PROFILE_PIC: {uri: icNewProfilePicUri},
  DEFAULT_LANGUAGE: 'en',

  MY_WEIGH_URL: 'https://myweigh.com',
  PRIVACY_POLICY_URL:
    'https://docs.google.com/document/d/1Wk7o8XTBWcsqQaugbpUbm7gpWgkq7_LbPflE5yGAjmQ/edit#heading=h.q2k0pq54rdza',

  SETTINGS: {
    PREFERRED_UNITS_KEY: '@MW_preferred_units_key',
    PREFERRED_UNITS_DEFAULT: 'Metric',
    PREFERRED_UNITS_METRIC_KEY: '@MW_metric',
    PREFERRED_UNITS_METRIC_LABEL: 'Metric',
    PREFERRED_UNITS_IMPERIAL_KEY: '@MW_imperial',
    PREFERRED_UNITS_IMPERIAL_LABEL: 'Imperial / US Customary',
    AUTO_SPEAK_KEY: '@MW_auto_speak_key',
    HOLD_WEIGHT_KEY: '@MW_hold_weight_key',
    LANGUAGE_KEY: '@MW_language_key',
    AUTO_SPEAK_DEFAULT: false,
    HOLD_WEIGHT_DEFAULT: false,
    GOAL_KEY: '@MW_goal_key',
  },

  CURRENT_USER_KEY: '@MW_current_user',
  USERS_KEY: '@MW_users',
  USER_NOT_FOUND: null,

  SCREEN_HOME: 'Home',

  SCREEN_WEIGH: 'Weigh',
  SCREEN_WEIGH_MESSAGES: {
    CONGRATULATIONS: 'WEIGH.CONGRATULATIONS',
    HOLD: 'WEIGH.HOLD',
    TARE: 'WEIGH.TARE',
    SPEECH: 'WEIGH.SPEECH',
    SAVE: 'SAVE',
  },

  SCREEN_GRAPH: 'Graph',
  SCREEN_GRAPH_TITLE: 'Graph',

  SCREEN_EDIT_PROFILE: 'EditProfile',
  SCREEN_EDIT_PROFILE_TITLE: 'Edit Profile',
  SCREEN_EDIT_PROFILE_PARAM_NEW: '@MW_edit_profile_new',
  SCREEN_EDIT_PROFILE_PARAM_EDIT: '@MW_edit_profile_edit',

  SCREEN_PROFILES: 'Profiles',
  SCREEN_PROFILES_TITLE: 'Profiles',
  SCREEN_PROFILES_ICON: 'people',

  SCREEN_SAVE: 'Save',
  SCREEN_SAVE_TITLE: 'Save',
  SCREEN_SAVE_PARAM_WEIGHT: '@MW_weight_data',

  SCREEN_DATA: 'Data',
  SCREEN_DATA_TITLE: 'Data',
  SCREEN_DATA_PARAM_DATA: '@MW_data_data',

  SCREEN_SHARE: 'SocialShare',
  SCREEN_SHARE_TITLE: 'Share',
  SCREEN_SHARE_ICON: 'share',
  SCREEN_SHARE_PARAM_DATA: '@MW_share_data',

  SCREEN_SETTINGS: 'Settings',
  SCREEN_SETTINGS_TITLE: 'Settings',
  SCREEN_SETTINGS_ICON: 'settings',

  SCREEN_LANGUAGE: 'Language',
  SCREEN_LANGUAGE_TITLE: 'Language',

  SCREEN_PRIVACY_POLICY: 'PrivacyPolicy',
  SCREEN_PRIVACY_POLICY_TITLE: 'Privacy Policy',

  ICON_CANCEL: 'close',
  ICON_BACK: 'arrow-back',
  ICON_POWER_OFF: 'power-settings-new',
  ICON_ADD_PHOTO: 'add-a-photo',
  ADD_PHOTO_ICON_TYPE: 'MaterialIcons',

  FONT: {
    LIGHT: 'Quicksand-Light',
    NORMAL: 'Quicksand-Regular',
    MEDIUM: 'Quicksand-Medium',
    BOLD: 'Quicksand-Bold',
  },

  SCALE_FUNCTIONS: {
    UNIT: 'VQ==',
    TARE: 'Wg==',
    HOLD: 'SA==',
    POWER: 'Tw==',
  },

  SCALE_UNITS: {
    KILO: 'kg',
    POUND: 'lb',
    POUND_OUNCE: 'lb:oz',
  },

  DISPLAY_UNITS: {
    KILO: 'kg',
    POUND: 'lb',
    OUNCE: 'oz',
  },

  SELECT_UNITS: [
    {label: 'kg', value: 'kg'},
    {label: 'lb', value: 'lb'},
    {label: 'lb:oz', value: 'lb:oz'},
  ],

  CONVERSIONS: {
    GRAMS_KILO: 1000,
    GRAMS_POUND: 453.592,
    GRAMS_OUNCE: 28.3495,
    OUNCES_GRAM: 0.0352739619,
    OUNCES_POUND: 16,
  },

  ORIENTATION: {
    LANDSCAPE: 'LANDSCAPE',
    PORTRAIT: 'PORTRAIT',
  },

  MODES: {
    ALL: 0,
    MONTH: 1,
    WEEK: 2,
  },
  MODE_NAME: {
    0: 'ALL_TIME',
    1: 'PER_MONTH',
    2: 'PER_WEEK',
  },
  CHANGE_PERIOD_LABEL: {
    1: 'CHANGE_MONTH',
    2: 'CHANGE_WEEK',
  },
  KEYBOARD_AVOIDING_VIEW_BEHAVIOUR: Platform.select({
    ios: 'padding',
    android: null,
  }),
  DATE_FORMATS: {
    DEFAULT: 'DD-MM-YYYY',
    EN: 'MM-DD-YYYY',
  },
  locale: Platform.select({
    ios: () => NativeModules.SettingsManager.settings.AppleLocale,
    android: () => NativeModules.I18nManager.localeIdentifier,
  }),
  LOCALES: {
    EN: 'en_US',
  },
  TOAST_SETTINGS: {
    DURATION: 4500,
    DELAY: 0,
  },
  BLE_ERROR_CODE_NAMES: {
    BLUETOOTH_UNAUTHORIZED: 101,
    BLUETOOTH_POWERED_OFF: 102,
    DEVICE_DISCONNECTED: 201,
    LOCATION_SERVICES_DISABLED: 601,
  },
  BLE_ERROR_CODES: {
    102: 'WEIGH.TURN_ON_BLUETOOTH',
    601: 'WEIGH.TURN_ON_LOCATION',
    201: 'WEIGH.TURN_ON_SCALE',
  },
  BLE_CONNECTION_STATUS: {
    SCANNING: 'WEIGH.SCANNING',
    CONNECTING: 'WEIGH.CONNECTING',
    CONNECTED: 'WEIGH.CONNECTED',
    DISCONNECT: 'WEIGH.DISCONNECT',
    ENABLE_PERMISSION: 'WEIGH.ENABLE_PERMISSION',
  },
  LANGUAGES: [
    {
      title: 'English',
      code: 'en',
    },
    {
      title: 'Español',
      code: 'es',
    },
    {
      title: 'Français',
      code: 'fr',
    },
    {
      title: 'Deutsch',
      code: 'de',
    },
  ],
  GRAPH_CALCULATE: {
    WEIGHT_MINIMAL_RANGE: 200,
    WEIGHT_MIDDLE_RANGE: 300,
    WEIGHT_MAXIMUM_RANGE: 500,
  },
  GRAPH_INITIAL_STATE: {
    zoomDomain: {},
    data: [],
  },
  ALERTS: {
    DEFAULT_ALERT: 'defaultAlert',
    DUPLICATE_USERNAME: 'duplicateUsername',
  },
};
