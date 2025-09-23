import I18n from 'react-native-i18n';
import CONSTANTS from './constants';

console.log('RESULT', I18n.t('PRIVACY_POLICY.TITLE'));
const settings = [
  {
    title: I18n.t('LANGUAGE.TITLE'),
    routeName: CONSTANTS.SCREEN_LANGUAGE_TITLE,
  },
  {
    title: I18n.t('PRIVACY_POLICY.TITLE'),
    routeName: CONSTANTS.SCREEN_PRIVACY_POLICY,
  },
];
console.log('Privacy Policy Title:', I18n.t('PRIVACY_POLICY.TITLE'));
console.log('Language Title:', I18n.t('LANGUAGE.TITLE'));
export default settings;
