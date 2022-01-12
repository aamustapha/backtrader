import Strategy from "../modules/Strategy";
export default class CrossOverStrategy extends Strategy {
  stopLoss = 0.1

  async entryCondition() {
    // const crossOverPoint = await this.ta.maCrossBuy(["sma", "ema"], [20, 100]);
    // return crossOverPoint.length > 0;
    return this.ta.marketData.length > 2;
  }
}
