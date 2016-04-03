import React, {
  Component,
  StyleSheet
} from 'react-native';

import { CombinedChart } from 'react-native-ios-charts';

import { RawData } from './Data.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch'
  }
});

export default class Combined extends Component {
  static displayName = 'Combined';

  render() {
    
    var barDataValue = [];
    var candleDataValue = [];
    var candleDataColor = [];
    var labels = [];
    var smallestShadowL = Number.MAX_VALUE;
    var biggestVolume = Number.MIN_VALUE;

    var trades = RawData.trades;
    var date = 21;
    var i = 0;
    for (const trade of trades) {
      // bar data
      barDataValue.push(trade.volume);
      // candlestick data
      candleDataValue.push({
        shadowL: trade.low,
        shadowH: trade.high,
        open: trade.open > trade.close ? trade.open : trade.close,
        close: trade.close < trade.open ? trade.close : trade.open ,
      });
      // candlestick color
      var color = trade.open > trade.close ? 'green' : 'red';
      candleDataColor.push(color);

      // find the smallest of shadowL
      if (trade.low < smallestShadowL)
        smallestShadowL = trade.low;

      // find biggest volume
      if (trade.volume > biggestVolume)
        biggestVolume = trade.volume;

      // data

      if (i++ % 5 == 0)
        date++; 

      labels.push('Mar ' + date);
    }

    // handle bar data
    for (var i in barDataValue) {
      barDataValue[i] = barDataValue[i] / biggestVolume * smallestShadowL;
    }

    const config = {
      barData: {
        dataSets: [{
          values: barDataValue,
          drawValues: false,
          colors: ['rgb(107, 243, 174)']
        }]
      },
      candleData: {
        dataSets: [{
          values: candleDataValue,
          colors: candleDataColor,
          drawValues: false
        }],
      },
      drawBarShadowEnabled: false,
      backgroundColor: 'transparent',
      // labels: ['1990', '1991', '1992', '1993', '1994', '1995'],
      labels: labels,
      showLegend: false,
      xAxis: {
        position: 'bottom'
      },
      leftAxis: {
        drawGridLines: false,
        spaceBottom: 0.05
      },
      rightAxis: {
        drawGridLines: false,
        spaceBottom: 0.05
      },
      valueFormatter: {
        type: 'regular',
        maximumDecimalPlaces: 0
      }
    };
    return (
      <CombinedChart config={config} style={styles.container}/>
    );
  }
}
