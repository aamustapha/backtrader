import Binding from "../modules/Binding";
import { Order } from "../types/order";
import { Candle } from "../types/analysis";
import EventEmitter from "events";

export default class BinanceBinding extends Binding {
  constructor() {
    super();
  }

  fakeC: Candle[] = require("./data.json");
  async readMarketData() {
    this.fakeCandles();
  }

  async fakeCandles() {
    for (const i in this.fakeC) {
      await this.recurse(+i);
      if (this.event.listeners("update").length === 0) {
        console.log("Finished");
        // return Promise.resolve("x");
      }
    }
  }

  async recurse(length: number) {
    let fakeCandles = this.fakeC;
    const first = fakeCandles[0].close;
    fakeCandles = fakeCandles.slice(0, length);
    const _vm = this;

    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("a");
        _vm.publish(fakeCandles);
      }, 5);
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
