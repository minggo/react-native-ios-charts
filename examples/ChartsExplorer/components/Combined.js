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

const monthString = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

export default class Combined extends Component {
  static displayName = 'Combined';

  render() {
    
    var barDataValue = [];
    var candleDataValue = [];
    var candleDataColor = [];
    var labels = [];
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

      // find biggest volume
      if (trade.volume > biggestVolume)
        biggestVolume = trade.volume;

      // data
      var date = new Date(trade.date);
      // var dateString = monthString[date.getMonth() - 1] + ' ' + date.getDay();
      var dateString = monthString[date.getMonth() - 1] + ' ' + 22;

      labels.push(dateString);
    }

    // handle bar data
    var smallestBar = RawData.min / 1.1;
    var distance = RawData.min - smallestBar;
    for (var i in barDataValue) {
      barDataValue[i] = smallestBar + (barDataValue[i] / biggestVolume * distance);
    }

    const config = {
      barData: {
        dataSets: [{
          values: barDataValue,
          drawValues: false,
          colors: ['rgb(211,211,211)']
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
      labels: labels,
      showLegend: false,
      drawBorders: true,
      xAxis: {
        position: 'bottom',
        avoidFirstLastClipping: true,
        textSize: 7.5,
        gridDashedLine: {
          lineLength: 1,
          spaceLength: 1
        }
      },
      leftAxis: {
        drawLabels: false,
        drawGridLines: false,
        spaceBottom: 0,
      },
      rightAxis: {
        drawGridLines: true,
        spaceBottom: 0,
        gridDashedLine: {
          lineLength: 1,
          spaceLength: 1
        }
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
