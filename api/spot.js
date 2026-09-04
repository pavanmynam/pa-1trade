export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-store');

  // SAFE FETCH - Fail ayina kuda default istondi - App aagadu
  async function safePrice(symbol, fallback) {
    try {
      const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!r.ok) throw new Error('yahoo fail');
      const j = await r.json();
      const price = j?.chart?.result?.[0]?.meta?.regularMarketPrice;
      return price || fallback;
    } catch (e) {
      return fallback;
    }
  }

  async function safeBTC() {
    try {
      const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,inr');
      const j = await r.json();
      return { usd: j.bitcoin.usd, inr: j.bitcoin.inr };
    } catch (e) {
      return { usd: 111234, inr: 9340000 };
    }
  }

  // PARALLEL - Okati fail ayina migatavi vastayi
  const niftyP = await safePrice('%5ENSEI', 24985.5);
  const bankP = await safePrice('%5ENSEBANK', 57544.2);
  const sensexP = await safePrice('%5EBSESN', 81400.12);
  const dowP = await safePrice('%5EDJI', 44500);
  const nasdaqP = await safePrice('%5EIXIC', 19500);
  const goldFP = await safePrice('GC=F', 2655.50);
  const btcP = await safeBTC();

  let gold = goldFP;
  if (gold > 3500 || gold < 2000) gold = 2655.50;
  let goldInr = Math.round(gold * 84.5 / 31.1 * 10);
  let isUp = dowP > 44000;

  res.status(200).json({
    nifty: Number(niftyP).toFixed(2),
    bank: Number(bankP).toFixed(2),
    sensex: Number(sensexP).toFixed(2),
    dow: Number(dowP).toFixed(0),
    nasdaq: Number(nasdaqP).toFixed(0),
    gold: Number(gold).toFixed(2),
    goldInr: goldInr,
    goldFuture: (Number(gold) + 6).toFixed(2),
    btcUsd: btcP.usd,
    btcInr: btcP.inr,
    signal: isUp? "STRONG CALL" : "STRONG PUT",
    hint: isUp? "🟢 US UP = NIFTY GAP UP | CALL BIAS | BUY ON DIP" : "🔴 US DOWN = NIFTY GAP DOWN | PUT BIAS | SELL ON RISE",
    time: new Date().toISOString()
  });
}
