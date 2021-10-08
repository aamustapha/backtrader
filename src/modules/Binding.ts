import { Order } from "../types/order";
import { Candle } from "../types/analysis";
import EventEmitter from "events";

export default class Binding {
  event = new EventEmitter();

  publish(candles: Candle[]) {
    this.event.emit("update", candles);
  }

  unsubscribe(event: string) {
    this.event.removeAllListeners();
  }

  subscribe(event: string, handler: Function) {
    this.event.on(event, (candles: Candle[]) => {
      handler(candles);
    });
  }

  readMarketData(): void {
    Promise.reject("Not implemented");
  }

  open(): Promise<Order> {
    return Promise.reject("Not implemented");
  }

  close(): Promise<Order> {
    return Promise.reject("Not implemented");
  }
}
