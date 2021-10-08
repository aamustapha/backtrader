import DeepAnalysis from "./DeepAnalysis";
import { Candle } from "../types/analysis";
import Position from "./Position";
import Binding from "./Binding";

export default class Strategy {
  ta: DeepAnalysis;

  handler: Binding;
  open?: Position;
  constructor(ta: DeepAnalysis, handler: Binding) {
    this.ta = ta;
    this.handler = handler;
  }

  entryCondition() {
    return false;
  }

  updateFeed(candles: Candle[]) {
    if (this.open?.isOpen) {
      const last = candles.at(-1);
      if (!last) {
        return
      }
      this.open.priceUpdate(last.close);
    } else {
      this.ta.updateMarketData(candles);
      this.check();
    }
  }

  check() {
    if (this.entryCondition()) {
      this.open = new Position(this.handler, "BUY", "ASSET", 2, 10, 0.05);
    }
  }
}
