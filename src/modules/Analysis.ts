import fs from "fs";
import {
  ApplyTo,
  Candle,
  IndicatorLevel,
  MovingAverageType,
  TalibFunctionReturn,
} from "../types/analysis";
const talib = require("../node_modules/talib/build/Release/talib.node");

export default class Analysis {
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

  explain(func: string) {
    return new Promise((resolve, reject) => {
      const function_desc = talib.explain(func);
      resolve(function_desc);
    });
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
