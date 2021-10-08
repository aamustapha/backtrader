import Binding from "../modules/Binding";
import { Order } from "../types/order";

export default class BinanceBinding extends Binding {
  constructor() {
    super();
  }

  open(): Promise<Order> {
    return Promise.resolve({ price: 10 });
  }

  close(): Promise<Order> {
    return Promise.resolve({ price: 15 });
  }
}
