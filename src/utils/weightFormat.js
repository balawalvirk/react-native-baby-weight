import constants from 'config/constants';
import I18n from 'react-native-i18n';

export const gramsAsKilos = (weight, toFixedNumber = 2, i18nKg) =>
  `${(weight / constants.CONVERSIONS.GRAMS_KILO).toFixed(toFixedNumber)}${i18nKg}`;
export const gramsAsPound = (weight, toFixedNumber = 2, i18nLb) =>
  `${(weight / constants.CONVERSIONS.GRAMS_POUND).toFixed(toFixedNumber)}${i18nLb}`;
export const gramsAsPoundOunces = (weight, toFixedNumber = 2, i18nLb, i18nOz) => {
  const ounces = weight * constants.CONVERSIONS.OUNCES_GRAM;
  return `${Math.floor(ounces / constants.CONVERSIONS.OUNCES_POUND)}${i18nLb} ${(
    ounces % constants.CONVERSIONS.OUNCES_POUND
  ).toFixed(toFixedNumber)}${i18nOz}`;
};
const gramsAsKilosNumber = (n, toFixedNumber = 2) => (n / constants.CONVERSIONS.GRAMS_KILO).toFixed(toFixedNumber);
const gramsAsPoundNumber = (n, toFixedNumber = 3) => (n / constants.CONVERSIONS.GRAMS_POUND).toFixed(toFixedNumber);
export const recountWeight = ({
  unit,
  weight,
  isNumber = false,
  i18nKg = constants.DISPLAY_UNITS.KILO,
  i18nLb = constants.DISPLAY_UNITS.POUND,
  i18nOz = constants.DISPLAY_UNITS.OUNCE,
  toFixedNumber,
}) => {
  switch (unit) {
    case constants.SCALE_UNITS.KILO:
      return isNumber ? gramsAsKilosNumber(weight, toFixedNumber) : gramsAsKilos(weight, toFixedNumber, i18nKg);
    case constants.SCALE_UNITS.POUND:
      return isNumber ? gramsAsPoundNumber(weight, toFixedNumber) : gramsAsPound(weight, toFixedNumber, i18nLb);
    case constants.SCALE_UNITS.POUND_OUNCE:
      return gramsAsPoundOunces(weight, toFixedNumber, i18nLb, i18nOz);
  }
};

export const convertAudioWeight = (value) => {
  if (I18n.locale === 'en') {
    return value;
  }
  return value.replace('.', ',');
};
