import Binding from "./Binding";
import Strategy from "./Strategy";
import DeepAnalysis from "./DeepAnalysis";
import { Candle } from "../types/analysis";
export default class Trader {
  handler: Binding;
  strategy: Strategy;
  balance: number;

  constructor(
    balance: number,
    exposure: number,
    handler: Binding,
    strategy: typeof Strategy
  ) {
    this.handler = handler;
    this.balance = balance;
    const ta = new DeepAnalysis([], 2000);
    this.strategy = new strategy(ta, handler, this.allocate(balance, exposure));
  }

  async run() {
    this.handler.readMarketData();
    this.strategy.on("close", () => {
      if (this.strategy.tradePosition)
        this.balance += this.strategy.tradePosition.totalProfit();
      console.log("Final balance: " + this.balance);
      this.handler.unsubscribe("update");
    });
    this.handler.subscribe("update", (candles: Candle[]) => {
      this.strategy.updateFeed(candles);
    });
  }

  allocate(total: number, exposure: number): number {
    return exposure * total;
  }
}
