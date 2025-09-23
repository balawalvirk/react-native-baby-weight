import React, {Component} from 'react';
import {View, Platform} from 'react-native';
import PropTypes from 'prop-types';
import Svg from 'react-native-svg';
import {
  VictoryChart,
  VictoryAxis,
  VictoryArea,
  VictoryScatter,
  VictoryClipContainer,
  VictoryLine,
} from 'victory-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import I18n from 'react-native-i18n';
import {calendar, weightFormat} from 'utils';
import FLPager from 'components/external/FLPager';
import FLContainer from 'components/core/FLContainer';
import constants from 'config/constants';
import colors from 'config/colors';
import styles, {font, victoryLine} from './styles';

const modesLength = Object.keys(constants.MODES).length;

class MWGraph extends Component {
  cycleMode(back = false) {
    const {mode, handleModeChange} = this.props;
    let viewMode = null;
    if (back) {
      viewMode = mode - 1 >= 0 ? mode - 1 : modesLength - 1;
    } else {
      viewMode = mode + 1 < modesLength ? mode + 1 : 0;
    }

    handleModeChange(viewMode);
  }

  generateGoalData() {
    const {zoomDomain, goal} = this.props;
    return goal && zoomDomain && zoomDomain.x
      ? [
          {
            key: 0,
            weight: goal,
            date: zoomDomain.x[0],
          },
          {
            key: 1,
            weight: goal,
            date: calendar.addDays(new Date(), 30),
          },
        ]
      : [];
  }

  render() {
    const {zoomDomain, data, mode, selectedUnit} = this.props;
    const dataWithLastElement = [
      ...data,
      {
        key: 0,
        weight: data[data.length - 1].weight,
        date: calendar.addDays(new Date(), 30).valueOf(),
      },
    ];
    const vb = `0 0 ${wp('95%')} 250`;
    const goalData = this.generateGoalData();

    return (
      <View style={styles.container}>
        {data.length !== 1 ? (
          <FLPager
            text={I18n.t(`GRAPH.${constants.MODE_NAME[mode]}`)}
            leftIcon="chevron-left"
            leftButton={() => this.cycleMode(true)}
            rightIcon="chevron-right"
            rightButton={() => this.cycleMode()}
          />
        ) : (
          <View style={styles.emptyView} />
        )}
        <FLContainer style={styles.chartContainer}>
          <Svg width={wp('100%')} style={styles.graphSvg} height={250} viewBox={vb}>
            <VictoryChart
              standalone={false}
              width={wp('100%')}
              height={250}
              scale={{x: 'time'}}
              padding={{top: 30, bottom: 40, left: 55, right: 10}}
              domain={zoomDomain}
              domainPadding={{x: 10}}>
              <VictoryAxis
                fixLabelOverlap={true}
                style={{
                  tickLabels: {
                    fontFamily: font,
                  },
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(y) =>
                  weightFormat.recountWeight({unit: selectedUnit, weight: y, isNumber: true, toFixedNumber: 1})
                }
                label={selectedUnit}
                style={{
                  axisLabel: {
                    fontWeight: 'bold',
                    fontFamily: font,
                    fontSize: 16,
                    angle: 0,
                    dx: Platform.select({
                      ios: 4,
                      android: 3,
                    }),
                    dy: -105,
                  },
                  tickLabels: {
                    fontFamily: font,
                  },
                }}
              />
              <VictoryArea
                data={dataWithLastElement}
                name="line"
                style={{
                  data: {
                    stroke: colors.PRIMARY,
                    strokeWidth: 2,
                    fill: colors.PRIMARY_LIGHT,
                    fillOpacity: 1,
                  },
                }}
                x="date"
                y="weight"
              />
              <VictoryScatter
                data={dataWithLastElement}
                groupComponent={<VictoryClipContainer />}
                size={5}
                style={{
                  data: {
                    fill: (point) => point.fill || colors.LIGHT,
                    stroke: colors.PRIMARY_DARK,
                    strokeWidth: 2,
                  },
                }}
                labels={() => null}
                x="date"
                y="weight"
              />
              <VictoryLine style={victoryLine} data={goalData} size={5} x="date" y="weight" />
            </VictoryChart>
          </Svg>
        </FLContainer>
      </View>
    );
  }
}

MWGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MWGraph;
