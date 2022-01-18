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
class CandlePatternAnalysis extends BaseAnalysis {
  constructor(marketData: Candle[], depth = 1000) {
    super(marketData, depth);
    this.depth = depth;
    this.marketData = marketData;

    this.updateMarketData(marketData);
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

  twoCrows(): Promise<CandlePattern[]> {
    return this.candlePattern("CDL2CROWS").then(
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

  threeCrows(): Promise<CandlePattern[]> {
    return this.candlePattern("CDL3BLACKCROWS").then(
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

  threeInsideUpDown(): Promise<CandlePattern[]> {
    return this.candlePattern("CDL3INSIDE").then(
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

  threeLineStrike(): Promise<CandlePattern[]> {
    return this.candlePattern("CDL3LINESTRIKE").then(
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

  threeOutsideUpDown(): Promise<CandlePattern[]> {
    return this.candlePattern("CDL3OUTSIDE").then(
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

  starInTheSouth(): Promise<CandlePattern[]> {
    return this.candlePattern("CDL3STARSINSOUTH").then(
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

  advancingWhiteSoldiers(): Promise<CandlePattern[]> {
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

  abandonedBaby(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLABANDONEDBABY").then(
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

  advanceBlock(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLADVANCEBLOCK").then(
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

  beltHold(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLBELTHOLD").then(
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

  breakaway(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLBREAKAWAY").then(
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

  closingMarubozu(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLCLOSINGMARUBOZU").then(
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

  babySwallow(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLCONCEALBABYSWALL").then(
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

  counterAttack(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLCOUNTERATTACK").then(
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

  darkCloudCover(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLDARKCLOUDCOVER").then(
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

  doji(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLDOJI").then(
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

  dojiStar(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLDOJISTAR").then(
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

  dragonflyDoji(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLDRAGONFLYDOJI").then(
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

  eveningDojiStar(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLEVENINGDOJISTAR").then(
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

  eveningStar(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLEVENINGSTAR").then(
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

  DUMMY(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLGAPSIDESIDEWHITE").then(
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

  gravestoneDoji(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLGRAVESTONEDOJI").then(
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

  hangingMan(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLHANGINGMAN").then(
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

  harami(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLHARAMI").then(
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

  haramiCross(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLHARAMICROSS").then(
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

  highWaveCandle(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLHIGHWAVE").then(
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

  hikkake(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLHIKKAKE").then(
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

  hikkakeModified(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLHIKKAKEMOD").then(
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

  homingPigeon(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLHOMINGPIGEON").then(
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

  identicalThreeCrows(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLIDENTICAL3CROWS").then(
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

  inNeck(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLINNECK").then(
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

  kicking(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLKICKING").then(
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

  kickingByLength(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLKICKINGBYLENGTH").then(
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

  ladder(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLLADDERBOTTOM").then(
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

  longLeggedDoji(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLLONGLEGGEDDOJI").then(
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

  longLine(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLLONGLINE").then(
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

  marubozu(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLMARUBOZU").then(
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

  matchingLow(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLMATCHINGLOW").then(
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

  matHold(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLMATHOLD").then(
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

  morningDojiStar(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLMORNINGDOJISTAR").then(
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

  onNeck(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLONNECK").then(
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

  rickshawMan(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLRICKSHAWMAN").then(
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

  risingFallingMethods(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLRISEFALL3METHODS").then(
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

  separatingLines(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLSEPARATINGLINES").then(
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

  shootingStar(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLSHOOTINGSTAR").then(
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

  shortLineCandle(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLSHORTLINE").then(
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

  spinningTop(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLSPINNINGTOP").then(
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

  stalled(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLSTALLEDPATTERN").then(
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

  stickSandwich(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLSTICKSANDWICH").then(
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

  takuri(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLTAKURI").then(
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

  tasuki(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLTASUKIGAP").then(
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

  thrusting(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLTHRUSTING").then(
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

  tristar(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLTRISTAR").then(
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

  uniqueThreeRiver(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLUNIQUE3RIVER").then(
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

  upsideGap2(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLUPSIDEGAP2CROWS").then(
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

  upsideGap3(): Promise<CandlePattern[]> {
    return this.candlePattern("CDLXSIDEGAP3METHODS").then(
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
      this.advancingWhiteSoldiers(),
      this.invertedHammer(),
      this.hammer(),
    ]).then((patterns) => {
      const [engulfing, piercing, whiteSoldier, invertedHammer, hammer] =
        patterns;

      return { engulfing, piercing, whiteSoldier, invertedHammer, hammer };
    });
  }
}

class IndicatorAnalysis extends CandlePatternAnalysis {
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
  },
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

}
export default class Analysis extends IndicatorAnalysis {
  adxLine(period: number): Promise<IndicatorLevel[]> {
    return this.adx(period).then((adx) => {
      const adxLine = adx.result.outReal;
      adxLine.splice(0, 0, ...Array(adx.begIndex));
      return this.marketData.map((candle, index) => {
        return { timestamp: candle.timestamp, level: adxLine[index] };
      });
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
