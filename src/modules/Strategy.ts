import DeepAnalysis from "./DeepAnalysis";
import { Candle } from "../types/analysis";
import Position from "./Position";
import Binding from "./Binding";
import { EventEmitter } from "stream";

Array.prototype.at = function (index) {
  // at available in v16+
  if (index < 0) {
    index = this.length + index;
  }
  return this[index];
};
export default class Strategy extends EventEmitter {
  ta: DeepAnalysis;

  handler: Binding;
  tradePosition?: Position;
  stopLoss = 0.05;
  trailingStop = 0.02;
  cash: number;

  constructor(ta: DeepAnalysis, handler: Binding, cash: number) {
    super();
    this.ta = ta;
    this.handler = handler;
    this.cash = cash;
  }

  async entryCondition() {
    return false;
  }

  lotSize(price: number): number {
    return +(this.cash / price).toFixed(4);
  }

  updateFeed(candles: Candle[]) {
    if (this.tradePosition?.isOpen) {
      const last = candles.at(-1);
      if (!last) {
        return;
      }
      this.tradePosition.priceUpdate(last.close);
    } else {
      this.ta.updateMarketData(candles);
      this.check();
    }
  }

  async check() {
    if (await this.entryCondition()) {
      const last = this.ta.marketData.at(-1);
      if (!last) {
        return;
      }
      this.tradePosition = new Position(
        this.handler,
        "BUY",
        "ASSET",
        this.lotSize(last.close),
        last.close,
        this.stopLoss,
        this.trailingStop
      );
      // this.tradePosition.on("open", (trade) => {
      //   trade;
      // });
      this.tradePosition.on("close", (trade) => {
        this.emit("close", this.tradePosition?.margin);
        this.tradePosition = undefined;
      });
    }
  }
}
