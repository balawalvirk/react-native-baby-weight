import base64 from 'react-native-base64';
import {convertAudioWeight} from 'utils/weightFormat';

export const convertWeightValues = (characteristicValue) => {
  const raw = base64.decode(characteristicValue);
  const weightDetected = raw.slice(1, 9).trim();
  const unit = raw.slice(9, raw.length - 1).trim();
  const firstPointIndex = weightDetected.indexOf('.');
  const ounces = weightDetected.slice(firstPointIndex + 1, 9);
  const pounds = weightDetected.slice(0, firstPointIndex);

  return {
    weightDetected,
    unit,
    firstPointIndex,
    pounds,
    ounces,
    audioWeightLocale: convertAudioWeight(weightDetected),
    audioOuncesLocale: convertAudioWeight(ounces),
  };
};
