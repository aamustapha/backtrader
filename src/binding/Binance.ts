import Binding from "../modules/Binding";
import { Order } from "../types/order";
import { Candle, MetaCandle } from "../types/analysis";
import EventEmitter from "events";

export default class BinanceBinding extends Binding {
  constructor() {
    super();
  }

  fakeC: MetaCandle[] = require("./data.json");

  multipler = [
    0, 1, 10, 4, 2, 1, 2, 1, 3, 2, 2, 1, 2, 2, 1, 3, 4, 6, 7, 5, 6, 5, 5, 4, 2,
    7, 8, 9, 10, 9, 8, 7, 6, 5,
  ];
  async readMarketData() {
    this.fakeCandles();
  }


  async fakeCandles() {
    for (const i in this.multipler) {
      await this.recurse(+i);
      if (
        +i === this.multipler.length - 1 ||
        this.event.listeners("update").length === 0
      ) {
        return Promise.resolve("x");
      }
    }
  }

  async recurse(length: number) {
    let fakeCandles = this.fakeC;
    const first = fakeCandles[0].close;
    fakeCandles = fakeCandles.slice(0, length).map((candle, index) => {
      candle.close = first + first * (this.multipler[index] / 100);
      return candle;
    });
    const _vm = this;

    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("a");
        _vm.publish(fakeCandles);
      }, 400);
    });
  }

  update(): Promise<Candle[]> {
    return Promise.reject("Not implemented");
  }

  open(): Promise<Order> {
    return Promise.resolve({ price: 10 });
  }

  close(): Promise<Order> {
    return Promise.resolve({ price: 15 });
  }
}
