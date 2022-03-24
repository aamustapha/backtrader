import BinanceBinding from "./binding/Dummy";
import CrossOverStrategy from "./strategy/CrossOver";
// import Trader from "./modules/Trader";
import Analysis from "./modules/Analysis";
import { Candle } from "./types/analysis";
// const binance = new BinanceBinding();

// const bot = new Trader(1000, 0.5, binance, CrossOverStrategy);
// bot.run().then((x) => {
//   console.log({ x });
// });
// const data: Candle[] = require("./ALGO15.json");
const data: Candle[] = require("./ETHXBT15.json");
const a = new Analysis(data, 10);

// a.explain("CDLHAMMER").then((r) => {
//   console.dir(r, { depth: null });
// });

a.getBullishPattern().then(pattern=>console.log(pattern))
a.getBearishPattern().then(pattern=>console.log(pattern))
a.getNeutralPattern().then(pattern=>console.log(pattern))
a.getBearishReversalPattern().then(pattern=>console.log(pattern))
a.getBullishReversalPattern().then(pattern=>console.log(pattern))
a.getTrendContinuationPattern().then(pattern=>console.log(pattern))
a.getTrendReversalPattern().then(pattern=>console.log(pattern))

// a.explain("CCI").then((info) => {
//   console.dir(info, { depth: null });
// });