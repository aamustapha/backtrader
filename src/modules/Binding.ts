import { Order } from "../types/order";

export default class Binding {
  open(): Promise<Order> {
    return Promise.reject("Not implemented");
  }

  close(): Promise<Order> {
    return Promise.reject("Not implemented");
  }
}
