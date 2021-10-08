import Analysis from "./Analysis";
import {
  Candle,
  ApplyTo,
  IndicatorLevel,
  MovingAverageType,
  TalibFunctionReturn,
} from "../types/analysis";
export default class DeepAnalysis extends Analysis {
  rsiBuyLevels(
    period: number = 14,
    applyTo: ApplyTo = "close",
    threshold = 23.5
  ) {
    return this.rsi().then((rsi) => {
      const rsiLevels = rsi.result.outReal;
      rsiLevels.splice(0, 0, ...Array(rsi.begIndex));
      const marketData: IndicatorLevel[] = this.marketData
        .map((candle, index): IndicatorLevel => {
          return { timestamp: candle.timestamp, level: rsiLevels[index] };
        })
        .filter((level) => level.level <= threshold)
        .map((point) => {
          point.price = this.marketData.find(
            (candle) => candle.timestamp === point.timestamp
          )?.close;
          return point;
        });
      return marketData;
    });
  }

  rsiSellLevels(
    period: number = 14,
    applyTo: ApplyTo = "close",
    threshold = 75
  ) {
    return this.rsi().then((rsi) => {
      const rsiLevels = rsi.result.outReal;
      rsiLevels.splice(0, 0, ...Array(rsi.begIndex));
      const marketData: IndicatorLevel[] = this.marketData
        .map((candle, index) => {
          return { timestamp: candle.timestamp, level: rsiLevels[index] };
        })
        .filter((level) => level.level >= threshold);
      return marketData;
    });
  }
  /**
   * A sma cross over buy signal is when the sma line cuts through a candle in an upward direction
   * A crossOver buy signal is a point where the sma price is higher than the open price but less than the close price
   *
   * @param period
   * @param applyTo
   * @returns
   */
  smaCrossOverBuy(period: number = 30, applyTo: ApplyTo = "close") {
    return this.sma(period, applyTo).then((sma) => {
      const smaLine = sma.result.outReal;
      smaLine.splice(0, 0, ...Array(sma.begIndex));
      const signalPoints: IndicatorLevel[] = this.marketData
        .map((candle, index) => {
          return { timestamp: candle.timestamp, level: smaLine[index] };
        })
        .filter((level, index) => {
          const candle = this.marketData[index];
          return level.level > candle.open && level.level < candle.close;
        });
      return signalPoints;
    });
  }

  /**
   * A sma cross over sell signal is when the sma line cuts through a candle in a downward direction
   * A crossOver sell signal is a point where the sma price is lower than the open price but higher than the close price
   *
   * @param period
   * @param applyTo
   * @returns
   */
  smaCrossOverSell(period: number = 30, applyTo: ApplyTo = "close") {
    return this.sma(period, applyTo).then((sma) => {
      const smaLine = sma.result.outReal;
      smaLine.splice(0, 0, ...Array(sma.begIndex));
      const signalPoints: IndicatorLevel[] = this.marketData
        .map((candle, index) => {
          return { timestamp: candle.timestamp, level: smaLine[index] };
        })
        .filter((level, index) => {
          const candle = this.marketData[index];
          return level.level < candle.open && level.level > candle.close;
        });
      return signalPoints;
    });
  }

  /**
   * A gollden cross would occur when we take 2 sequential points from both short and long MA lines,
   * and check if longMAline[0] is above shortMAline[1] but longMAline[1] is lower than shortMAline[2]
   * @param movingAverages
   * @param period
   * @param applyTo
   * @returns
   */
  maCrossBuy(
    movingAverages: [MovingAverageType, MovingAverageType],
    period: [number, number],
    applyTo: ApplyTo = "close"
  ): Promise<IndicatorLevel[]> {
    const [ma1, ma2] = movingAverages;
    const [period1, period2] = period;
    return Promise.all([
      this[ma1](period1, applyTo),
      this[ma2](period2, applyTo),
    ]).then((movingAverages) => {
      let shortMA: TalibFunctionReturn, longMA: TalibFunctionReturn;
      if (period1 < period2) {
        [shortMA, longMA] = movingAverages;
      } else {
        [longMA, shortMA] = movingAverages;
      }

      const shortMALine = shortMA.result.outReal;
      const longMALine = longMA.result.outReal;

      shortMALine.splice(0, 0, ...Array(shortMA.begIndex));
      longMALine.splice(0, 0, ...Array(longMA.begIndex));

      const crossOverPoints = shortMALine
        .map((point, index): IndicatorLevel => {
          return { timestamp: this.marketData[index].timestamp, level: point };
        })
        .filter((shortLine, index) => {
          const longLine = longMALine[index];
          if (
            index < 2 ||
            shortLine.level === undefined ||
            longLine === undefined
          ) {
            return false;
          }
          const prevShortLinePoint = shortMALine[index - 1];
          const prevLongLinePoint = longMALine[index - 1];
          if (
            prevLongLinePoint > prevShortLinePoint &&
            longLine < shortLine.level
          ) {
            return true;
          }
        })
        .map((point) => {
          point.price = this.marketData.find(
            (candle) => candle.timestamp === point.timestamp
          )?.close;
          return point;
        });
      return crossOverPoints;
    });
  }

  /**
   * A death cross would occur when we take 2 sequential points from both short and long MA lines,
   * and check if longMAline[0] is below shortMAline[1] but longMAline[1] is higher than shortMAline[2]
   * @param movingAverages
   * @param period
   * @param applyTo
   * @returns
   */
  maCrossSell(
    movingAverages: [MovingAverageType, MovingAverageType],
    period: [number, number],
    applyTo: ApplyTo = "close"
  ): Promise<IndicatorLevel[]> {
    const [ma1, ma2] = movingAverages;
    const [period1, period2] = period;
    return Promise.all([
      this[ma1](period1, applyTo),
      this[ma2](period2, applyTo),
    ]).then((movingAverages) => {
      let shortMA: TalibFunctionReturn, longMA: TalibFunctionReturn;
      if (period1 < period2) {
        [shortMA, longMA] = movingAverages;
      } else {
        [longMA, shortMA] = movingAverages;
      }

      const shortMALine = shortMA.result.outReal;
      const longMALine = longMA.result.outReal;

      shortMALine.splice(0, 0, ...Array(shortMA.begIndex));
      longMALine.splice(0, 0, ...Array(longMA.begIndex));

      const crossOverPoints = shortMALine
        .map((point, index): IndicatorLevel => {
          return { timestamp: this.marketData[index].timestamp, level: point };
        })
        .filter((shortLine, index) => {
          const longLine = longMALine[index];
          if (
            index < 2 ||
            shortLine.level === undefined ||
            longLine === undefined
          ) {
            return false;
          }
          const prevShortLinePoint = shortMALine[index - 1];
          const prevLongLinePoint = longMALine[index - 1];
          if (
            prevLongLinePoint < prevShortLinePoint &&
            longLine > shortLine.level
          ) {
            return true;
          }
        })
        .map((point) => {
          point.price = this.marketData.find(
            (candle) => candle.timestamp === point.timestamp
          )?.close;
          return point;
        });
      return crossOverPoints;
    });
  }
}
