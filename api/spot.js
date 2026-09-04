export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  async function getLive(symbol){
    try{
      const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m`, {headers:{'User-Agent':'Mozilla/5.0'}});
      const j = await r.json();
      return j.chart.result[0].meta.regularMarketPrice;
    }catch(e){ return null; }
  }

  const nifty = await getLive('%5ENSEI') || 23931.5;
  const bank = await getLive('%5ENSEBANK') || 57384.2;
  const sensex = await getLive('%5EBSESN') || 76559.1;
  const dow = await getLive('%5EDJI') || 43000;
  const gold = await getLive('GC=F') || 2650;

  let btcUsd = 67000;
  try{
    const b = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd').then(x=>x.json());
    btcUsd = b.bitcoin.usd;
  }catch(e){}

  res.status(200).json({
    nifty: nifty.toFixed(2),
    bank: bank.toFixed(2),
    sensex: sensex.toFixed(2),
    dow: dow.toFixed(0),
    gold: gold.toFixed(2),
    btcUsd,
    hint: dow > 43000 ? "US UP = NIFTY GAP UP" : "US DOWN = NIFTY GAP DOWN",
    time: new Date().toISOString()
  });
}
