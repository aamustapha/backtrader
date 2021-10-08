import { EventEmitter } from "stream";
import { Order } from "../types/order";
import Binding from "./Binding";

export default class Position extends EventEmitter {
  handler: Binding;

  type: string;
  asset: string;
  lot: number;
  entryPrice: number;
  currentPrice: number;

  trailingStop: number;
  exitPrice?: number;

  isOpen: Boolean = false;

  constructor(
    handler: Binding,
    type: string,
    asset: string,
    lot: number,
    price: number,
    stopLoss: number,
    trailingStop: number
  ) {
    super();
    this.handler = handler;
    this.type = type;
    this.asset = asset;
    this.lot = lot;
    this.entryPrice = price;
    this.currentPrice = price;
    this.trailingStop = trailingStop;

    this.open();
    this.calculateTrailingStop(stopLoss);
  }

  calculateTrailingStop(sl = this.trailingStop) {
    const stopLoss = (1 - sl) * this.currentPrice;
    if (
      !this.exitPrice ||
      (stopLoss > this.exitPrice &&
        this.profit() > 0 &&
        stopLoss > this.entryPrice)
    ) {
      // only move stoploss higher and than entry price
      this.exitPrice = stopLoss;
    }
  }

  priceUpdate(price: number) {
    if (!this.isOpen) {
      return;
    }
    this.currentPrice = price;
    this.check();
  }

  profit() {
    return this.currentPrice - this.entryPrice;
  }

  totalProfit() {
    return this.profit() * this.lot;
  }

  margin() {
    return this.profit() / this.entryPrice;
  }

  open() {
    this.isOpen = true;
    return this.handler.open().then((trade: Order) => {
      // this.entryPrice = trade.price;
      this.emit("open", trade);
    });
  }

  close() {
    this.isOpen = false;
    return this.handler.close().then((trade: Order) => {
      this.emit("close", trade);
    });
  }

  private check() {
    this.calculateTrailingStop();

    if (this.exitPrice && this.currentPrice <= this.exitPrice) {
      console.log(
        `Exiting trade.` +
          `\nTrade: ${this.lot * this.entryPrice}` +
          `\nLot: ${this.lot}` +
          `\nPrice: ${this.currentPrice} - ${this.entryPrice}` +
          `\nProfit => ${this.profit()}` +
          `\nMargin => ${(this.margin() * 100).toFixed(2)}%`
      );
      this.close();
    }
  }
}
