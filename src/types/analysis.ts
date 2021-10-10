export enum IntervalDuration {
  "5m" = 300,
  "15m" = 900,
  "30m" = 1800,
  "1h" = 3600,
  "4h" = 3600 * 4,
  "1d" = 86400,
}

export type Interval = keyof typeof IntervalDuration;

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
}

export interface MetaCandle extends Candle {
  volume: number;
}

export type ApplyTo = "open" | "high" | "low" | "close";

export type TalibFunctionReturn = {
  begIndex: number;
  nbElement: number;
  result: {
    outReal: number[];
  };
};

export type TalibCandlePatternReturn = {
  begIndex: number;
  nbElement: 983;
  result: {
    outInteger: number[];
  };
};

export type IndicatorLevel = {
  timestamp: number;
  level: number;
  price?: number;
};

export type CandlePattern = {
  timestamp: number;
  confidence: number;
  price?: number;
};

export type MovingAverageType = "sma" | "ema";
