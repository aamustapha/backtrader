import Position from "./modules/Position";
import BinanceBinding from "./binding/Binance";
const binance = new BinanceBinding();

const p = new Position(binance, "BUY", "ETH", 3, 10, 0.05);
p.priceUpdate(10.6);
p.priceUpdate(10.8);
p.priceUpdate(11);
p.priceUpdate(10.8);
p.priceUpdate(10.5);
p.priceUpdate(10.5);
p.priceUpdate(10.4);
