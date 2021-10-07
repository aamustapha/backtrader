import { Order } from "../types/order";
import Binding from "./Binding";

export default class Position {
  handler: Binding;

  type: string;
  asset: string;
  lot: number;
  entryPrice: number;
  currentPrice: number;

  trailingStop: number;
  exitPrice?: number;

  constructor(
    handler: Binding,
    type: string,
    asset: string,
    lot: number,
    price: number,
    trailingStop: number
  ) {
    this.handler = handler;
    this.type = type;
    this.asset = asset;
    this.lot = lot;
    this.entryPrice = price;
    this.currentPrice = price;
    this.trailingStop = trailingStop;

    this.open();
    this.calculateTrailingStop();
  }

  calculateTrailingStop() {
    const stopLoss = (1 - this.trailingStop) * this.currentPrice;
    if (
      !this.exitPrice ||
      (stopLoss > this.exitPrice &&
        this.profit() > 0 &&
        stopLoss > this.entryPrice)
    ) {
      // only move stoploss higher and than entry price
      this.exitPrice = stopLoss;
    }

    console.log(`Trailing stop at => ${this.exitPrice}`);
  }

  priceUpdate(price: number) {
    this.currentPrice = price;
    this.check();
  }

  profit() {
    return this.currentPrice - this.entryPrice;
  }

  margin() {
    return this.profit() / this.entryPrice;
  }

  open() {
    return this.handler.open().then((trade: Order) => {
      this.entryPrice = trade.price;
    });
  }

  close() {
    return this.handler.close();
  }

  private check() {
    this.calculateTrailingStop();

    if (this.exitPrice && this.currentPrice <= this.exitPrice) {
      console.log(
        `Exiting trade. \nProfit => ${this.profit()} \nMargin => ${(
          this.margin() * 100
        ).toFixed(2)}%`
      );
      this.close();
    }
  }
}
