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
const data: Candle[] = require("./ALGO15.json");
const a = new Analysis(data);

// a.explain("CDLHAMMER").then((r) => {
//   console.dir(r, { depth: null });
// });

a.cci().then((r) => {
    console.dir(r, { depth: null });
  // console.log(JSON.stringify(r));
}).catch(e => {
  console.dir(e, { depth: null });
});
// console.log(a.marketData[a.marketData.length - 1]);


// a.explain("CCI").then((info) => {
//   console.dir(info, { depth: null });
// });