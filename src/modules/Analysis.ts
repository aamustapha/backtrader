import fs from "fs";
import {
  ApplyTo,
  Candle,
  CandlePattern,
  IndicatorLevel,
  TalibCandlePatternReturn,
  TalibFunctionReturn,
} from "../types/analysis";
const talib = require("@/../../node_modules/talib/build/Release/talib.node");

class BaseAnalysis {
  marketData: Candle[];
  depth: number;

  constructor(marketData: Candle[], depth = 1000) {
    this.depth = depth;
    this.marketData = marketData;

    this.updateMarketData(marketData);
  }

  updateMarketData(marketData: Candle[]) {
    this.marketData = marketData;
    this.marketData = this.marketData.splice(-1 * this.depth);
  }

  explain(func: string) {
    return new Promise((resolve, reject) => {
      const function_desc = talib.explain(func);
      resolve(function_desc);
    });
  }
}
export default class Analysis extends BaseAnalysis {
  constructor(marketData: Candle[], depth = 1000) {
    super(marketData, depth);
    this.depth = depth;
    this.marketData = marketData;

    this.updateMarketData(marketData);
  }

  adx(period: number): Promise<TalibFunctionReturn> {
    return new Promise((resolve, reject) => {
      talib.execute(
        {
          name: "ADX",
          startIdx: 0,
          endIdx: this.marketData.length - 1,
          high: this.marketData.map((candle) => candle.high),
          low: this.marketData.map((candle) => candle.low),
          close: this.marketData.map((candle) => candle.close),
          optInTimePeriod: period,
        },
        function (err: Object, result: TalibFunctionReturn) {
          if (err) {
            return reject(err);
          }
          resolve(result);
        }
      );
    });
  }

  adxLine(period: number): Promise<IndicatorLevel[]> {
    return this.adx(period).then((adx) => {
      const adxLine = adx.result.outReal;
      adxLine.splice(0, 0, ...Array(adx.begIndex));
      return this.marketData.map((candle, index) => {
        return { timestamp: candle.timestamp, level: adxLine[index] };
      });
    });
  }

  candlePattern(pattern: string): Promise<TalibCandlePatternReturn> {
    return new Promise((resolve, reject) => {
      talib.execute(
        {
          name: pattern,
          startIdx: 0,
          endIdx: this.marketData.length - 1,
          open: this.marketData.map((candle) => candle.open),
          high: this.marketData.map((candle) => candle.high),
          low: this.marketData.map((candle) => candle.low),
          close: this.marketData.map((candle) => candle.close),
        },
        function (err: Object, result: TalibCandlePatternReturn) {
          if (err) {
            return reject(err);
          }
          resolve(result);
        }
      );
    });
  }

  ema(
    period: number = 30,
    applyTo: ApplyTo = "close"
  ): Promise<TalibFunctionReturn> {
    return new Promise((resolve, reject) => {
      talib.execute(
        {
          name: "EMA",
          startIdx: 0,
          endIdx: this.marketData.length - 1,
          inReal: this.marketData.map((candle) => candle[applyTo]),
          optInTimePeriod: period,
        },
        function (err: Object, result: TalibFunctionReturn) {
          if (err) {
            return reject(err);
          }
          resolve(result);
        }
      );
    });
  }

  emaLine(
    period: number = 30,
    applyTo: ApplyTo = "close"
  ): Promise<IndicatorLevel[]> {
    return this.ema(period, applyTo).then((sma) => {
      const smaLine = sma.result.outReal;
      smaLine.splice(0, 0, ...Array(sma.begIndex));
      return this.marketData.map((candle, index) => {
        return { timestamp: candle.timestamp, level: smaLine[index] };
      });
    });
  }

  hammer(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLHAMMER").then(
      (confidence: TalibCandlePatternReturn) => {
        const points = confidence.result.outInteger;
        points.splice(0, 0, ...Array(confidence.begIndex));
        return this.marketData
          .map((candle, index) => {
            return {
              timestamp: candle.timestamp,
              confidence: points[index],
              price: this.marketData[index + 1]?.open,
            };
          })
          .filter((point) => point.confidence > 0);
      }
    );
  }

  invertedHammer(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLINVERTEDHAMMER").then(
      (confidence: TalibCandlePatternReturn) => {
        const points = confidence.result.outInteger;
        points.splice(0, 0, ...Array(confidence.begIndex));
        return this.marketData
          .map((candle, index) => {
            return {
              timestamp: candle.timestamp,
              confidence: points[index],
              price: this.marketData[index + 1]?.open,
            };
          })
          .filter((point) => point.confidence > 0);
      }
    );
  }

  morningStart(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLMORNINGSTAR").then(
      (confidence: TalibCandlePatternReturn) => {
        const points = confidence.result.outInteger;
        points.splice(0, 0, ...Array(confidence.begIndex));
        return this.marketData
          .map((candle, index) => {
            return {
              timestamp: candle.timestamp,
              confidence: points[index],
              price: this.marketData[index + 1]?.open,
            };
          })
          .filter((point) => point.confidence > 0);
      }
    );
  }

  whiteSoldiers(): Promise<CandlePattern[]> {
    return this.candlePattern("CDL3WHITESOLDIERS").then(
      (confidence: TalibCandlePatternReturn) => {
        const points = confidence.result.outInteger;
        points.splice(0, 0, ...Array(confidence.begIndex));
        return this.marketData
          .map((candle, index) => {
            return {
              timestamp: candle.timestamp,
              confidence: points[index],
              price: this.marketData[index + 1]?.open,
            };
          })
          .filter((point) => point.confidence > 0);
      }
    );
  }

  piercingLine(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLPIERCING").then(
      (confidence: TalibCandlePatternReturn) => {
        const points = confidence.result.outInteger;
        points.splice(0, 0, ...Array(confidence.begIndex));
        return this.marketData
          .map((candle, index) => {
            return {
              timestamp: candle.timestamp,
              confidence: points[index],
              price: this.marketData[index + 1]?.open,
            };
          })
          .filter((point) => point.confidence > 0);
      }
    );
  }

  engulfing(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLENGULFING").then(
      (confidence: TalibCandlePatternReturn) => {
        const points = confidence.result.outInteger;
        points.splice(0, 0, ...Array(confidence.begIndex));
        return this.marketData
          .map((candle, index) => {
            return {
              timestamp: candle.timestamp,
              confidence: points[index],
              price: this.marketData[index + 1]?.open,
            };
          })
          .filter((point) => point.confidence > 0);
      }
    );
  }

  bullishSignal(lookBack: number) {
    return Promise.all([
      this.engulfing(),
      this.piercingLine(),
      this.whiteSoldiers(),
      this.invertedHammer(),
      this.hammer(),
    ]).then((patterns) => {
      const [engulfing, piercing, whiteSoldier, invertedHammer, hammer] =
        patterns;

      return { engulfing, piercing, whiteSoldier, invertedHammer, hammer };
    });
  }

  rsi(
    period: number = 14,
    applyTo: ApplyTo = "close"
  ): Promise<TalibFunctionReturn> {
    return new Promise((resolve, reject) => {
      talib.execute(
        {
          name: "RSI",
          startIdx: 0,
          endIdx: this.marketData.length - 1,
          inReal: this.marketData.map((candle) => candle[applyTo]),
          optInTimePeriod: period,
        },
        function (err: Object, result: TalibFunctionReturn) {
          if (err) {
            return reject(err);
          }
          resolve(result);
        }
      );
    });
  }

  rsiLine(
    period: number = 14,
    applyTo: ApplyTo = "close"
  ): Promise<IndicatorLevel[]> {
    return this.rsi(period, applyTo).then((rsi) => {
      const rsiLine = rsi.result.outReal;
      rsiLine.splice(0, 0, ...Array(rsi.begIndex));
      return this.marketData.map((candle, index) => {
        return { timestamp: candle.timestamp, level: rsiLine[index] };
      });
    });
  }

  sma(
    period: number = 30,
    applyTo: ApplyTo = "close"
  ): Promise<TalibFunctionReturn> {
    return new Promise((resolve, reject) => {
      talib.execute(
        {
          name: "SMA",
          startIdx: 0,
          endIdx: this.marketData.length - 1,
          inReal: this.marketData.map((candle) => candle[applyTo]),
          optInTimePeriod: period,
        },
        function (err: Object, result: TalibFunctionReturn) {
          if (err) {
            return reject(err);
          }
          resolve(result);
        }
      );
    });
  }

  smaLine(
    period: number = 30,
    applyTo: ApplyTo = "close"
  ): Promise<IndicatorLevel[]> {
    return this.sma(period, applyTo).then((sma) => {
      const smaLine = sma.result.outReal;
      smaLine.splice(0, 0, ...Array(sma.begIndex));
      return this.marketData.map((candle, index) => {
        return { timestamp: candle.timestamp, level: smaLine[index] };
      });
    });
  }
}
