import constants from 'config/constants';

export const dateFormat = (locale) =>
  locale === constants.LOCALES.EN ? constants.DATE_FORMATS.EN : constants.DATE_FORMATS.DEFAULT;
