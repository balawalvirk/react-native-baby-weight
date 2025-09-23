import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {momentFormats, weightFormat} from 'utils';
import styles from './styles';

const FLLinePoint = ({data, isLast, handleNavigatePress, selectedUnit, touchableStyle = {}, textStyle = {}}) => {
  const formattedWeight = weightFormat.recountWeight({
    unit: selectedUnit,
    weight: data.weight,
  });

  return (
    <TouchableHighlight onPress={handleNavigatePress} style={[styles.root, isLast ? styles.last : '', touchableStyle]}>
      <View style={styles.viev}>
        <Text style={[styles.text, textStyle]}>{momentFormats.mFormat(data.date)}</Text>
        <Text style={[styles.text, textStyle]}>{formattedWeight}</Text>
      </View>
    </TouchableHighlight>
  );
};

export default FLLinePoint;
