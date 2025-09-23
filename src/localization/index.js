import {NativeModules} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'react-native-i18n';
import constants from 'config/constants';
import fr from './locales/fr.json';
import es from './locales/es.json';
import en from './locales/en.json';
import de from './locales/de.json';

export const configureLocalization = async () => {
  const [deviceLang] = NativeModules.RNI18n.languages[0].split(/[-_]/);
  const savedLang = await AsyncStorage.getItem(constants.SETTINGS.LANGUAGE_KEY);
  const translations = {en, fr, es, de};
  const supportedLanguages = Object.keys(translations);

  Object.assign(i18n, {
    defaultLocale: constants.DEFAULT_LANGUAGE,
    fallbacks: true,
    missingTranslation: (key) => key,
    translations,
  });

  i18n.locale = savedLang || (supportedLanguages.includes(deviceLang) ? deviceLang : constants.DEFAULT_LANGUAGE);

  return i18n.locale;
};

export const updateLanguage = (lang) => {
  i18n.locale = lang;
  AsyncStorage.setItem(constants.SETTINGS.LANGUAGE_KEY, lang);
  return i18n.locale;
};
