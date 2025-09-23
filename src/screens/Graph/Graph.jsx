import React, {useCallback, useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import I18n from 'react-native-i18n';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import retrieveUserData from 'utils/getUserData';
import {recountWeight} from 'utils/weightFormat';
import {calendar} from 'utils';
import colors from 'config/colors';
import CONSTANTS from 'config/constants';
import FLLinePoint from 'components/core/FLLinePoint';
import MWGraph from 'components/myweigh/MWGraph';
import FLPlainTextView from 'components/composed/FLPlainTextView';
import FLLoading from 'components/composed/FLLoading';
import globalStyles from 'config/styles';
import styles from './styles';

const Graph = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState();
  const [state, setState] = useState(CONSTANTS.GRAPH_INITIAL_STATE);
  const [mode, setMode] = useState(CONSTANTS.MODES.ALL);

  console.log('UNIT',recountWeight({
    unit: userData?.selectedUnit,
    weight: userData?.goal,
    isNumber: true,
    toFixedNumber: 3,
  }))
  const retrieveData = async () => {
    const user = await retrieveUserData();
    setUserData(user);
  };

  useFocusEffect(
    useCallback(() => {
      retrieveData();
    }, []),
  );

  useEffect(() => {
    if (userData && userData.data.length) {
      calculateData(userData.data);
    }
  }, [userData, mode]);

  const handleModeChange = (dateMode) => {
    setMode(dateMode);
  };

  const handleNavigatePress = (key, index) => {
    const newData = [...data];
    newData[newData.length - index - 1] = {...newData[newData.length - index - 1], fill: colors.PRIMARY};
    setUserData((prevState) => ({
      ...prevState,
      data: newData,
      clickedListItemIndex: index,
    }));
    navigation.navigate(CONSTANTS.SCREEN_DATA, {
      [CONSTANTS.SCREEN_DATA_PARAM_DATA]: {dataPoint: newData[0], key},
    });
  };

  const handleSelectUnits = (user) => {
    return user.selectedUnit !== CONSTANTS.SCALE_UNITS.POUND_OUNCE ? user.selectedUnit : CONSTANTS.SCALE_UNITS.POUND;
  };

  const calculateData = (data) => {
    let dateMax = data[0].date;
    let dateMin = data[0].date;
    let weightMax = data[0].weight;
    let weightMin = data[0].weight;
    let delta = 0;
    const {goal} = userData;
    if (data.length === 1) {
      setState({
        zoomDomain: {
          x: [dateMin - new Date() + dateMin, new Date()],
          y: [
            weightMin > goal
              ? goal - CONSTANTS.GRAPH_CALCULATE.WEIGHT_MINIMAL_RANGE
              : weightMin - CONSTANTS.GRAPH_CALCULATE.WEIGHT_MIDDLE_RANGE,
            goal > weightMax
              ? goal + CONSTANTS.GRAPH_CALCULATE.WEIGHT_MAXIMUM_RANGE
              : weightMax + CONSTANTS.GRAPH_CALCULATE.WEIGHT_MAXIMUM_RANGE,
          ],
        },
        data,
        goal,
      });
      return;
    }

    for (const i in data) {
      dateMax = Math.max(dateMax, data[i].date);
      weightMax = Math.max(weightMax, data[i].weight);
      weightMin = Math.min(weightMin, data[i].weight);

      if (mode === CONSTANTS.MODES.ALL) {
        dateMin = Math.min(dateMin, data[i].date);

        setState({
          zoomDomain: {
            x: [dateMin, dateMax],
            y: [
              weightMin > goal
                ? goal - CONSTANTS.GRAPH_CALCULATE.WEIGHT_MINIMAL_RANGE
                : weightMin - CONSTANTS.GRAPH_CALCULATE.WEIGHT_MINIMAL_RANGE,
              goal > weightMax
                ? goal + CONSTANTS.GRAPH_CALCULATE.WEIGHT_MAXIMUM_RANGE
                : weightMax + CONSTANTS.GRAPH_CALCULATE.WEIGHT_MAXIMUM_RANGE,
            ],
          },
          data,
          goal,
        });
      }
    }

    switch (mode) {
      case CONSTANTS.MODES.ALL:
        return;
      case CONSTANTS.MODES.MONTH:
        delta = 30;
        break;
      case CONSTANTS.MODES.WEEK:
        delta = 7;
        break;
      default:
        delta = 0;
        break;
    }

    const dateBottomLine = calendar.addDays(new Date(), -delta).valueOf();
    const dateUpperLine = calendar.addDays(new Date(), 0).valueOf();

    const newData = data.filter((item) => {
      if (item.date >= dateBottomLine && item.date <= dateUpperLine) {
        dateMax = Math.max(dateMax, item.date);
        dateMin = Math.min(dateMin, item.date);
        return item;
      }
      return;
    });

    setState({
      zoomDomain: {
        x: [dateBottomLine, dateUpperLine],
        y: [
          weightMin > goal
            ? goal - CONSTANTS.GRAPH_CALCULATE.WEIGHT_MINIMAL_RANGE
            : weightMin - CONSTANTS.GRAPH_CALCULATE.WEIGHT_MINIMAL_RANGE,
          goal > weightMax
            ? goal + CONSTANTS.GRAPH_CALCULATE.WEIGHT_MAXIMUM_RANGE
            : weightMax + CONSTANTS.GRAPH_CALCULATE.WEIGHT_MAXIMUM_RANGE,
        ],
      },
      data: newData,
    });
  };

  if (!userData) {
    return <FLLoading />;
  }
  if (userData.data.length === 0) {
    return <FLPlainTextView text={I18n.t('GRAPH.NO_DATA')} />;
  }

  const {data, zoomDomain} = state;
  const {clickedListItemIndex, selectedUnit} = userData;

  const graphSelectedUnit = handleSelectUnits(userData);

  return (
    <View style={styles.graphContainer}>
      <MWGraph
        data={userData.data}
        goal={userData.goal}
        mode={mode}
        handleModeChange={handleModeChange}
        zoomDomain={zoomDomain}
        selectedUnit={graphSelectedUnit}
      />
      {!!userData.goal && (
        <FLPlainTextView
          text={`${I18n.t('EDIT_PROFILE.GOAL')}: ${userData?.goal || 0} ${handleSelectUnits(userData)}`}
          style={styles.goalTextView}
          textStyle={styles.goalText}
        />
      )}
      <View style={styles.scrollViewContainer}>
        {data.length ? (
          <>
            <FLPlainTextView
              text={I18n.t('GRAPH.WEIGHT_TRACKER')}
              style={styles.graphChoosePointView}
              textStyle={styles.graphChoosePointText}
            />
            <ScrollView style={styles.scrollView}>
              {data.map((el, index, arr) => (
                <FLLinePoint
                  touchableStyle={clickedListItemIndex === index ? {backgroundColor: colors.PRIMARY} : {}}
                  textStyle={clickedListItemIndex === index ? {color: colors.LIGHT} : {}}
                  handleNavigatePress={() => handleNavigatePress(arr[arr.length - index - 1].key, index)}
                  data={arr[arr.length - index - 1]}
                  isLast={index + 1 === data.length}
                  selectedUnit={selectedUnit}
                />
              ))}
            </ScrollView>
          </>
        ) : (
          <FLPlainTextView text={I18n.t('GRAPH.NO_DATA_POINTS')} style={globalStyles.textPadding} />
        )}
      </View>
    </View>
  );
};

export default Graph;
