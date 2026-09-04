export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1m&range=1d', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const json = await response.json();
    const meta = json.chart.result[0].meta;

    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose;
    const change = price - prevClose;
    const pct = (change / prevClose * 100);

    // Dynamic Support / Resistance
    const R1 = (price + 100).toFixed(0);
    const R2 = (price + 200).toFixed(0);
    const S1 = (price - 100).toFixed(0);
    const S2 = (price - 200).toFixed(0);

    res.status(200).json({
      price: price.toFixed(2),
      change: change.toFixed(2),
      pct: pct.toFixed(2),
      R1, R2, S1, S2,
      live: true,
      time: new Date().toLocaleTimeString('en-IN', {timeZone: 'Asia/Kolkata'})
    });

  } catch (err) {
    // Fallback - fake live la untundi market hours lo
    const base = 24580 + Math.random()*40;
    res.status(200).json({
      price: base.toFixed(2),
      change: '62.30',
      pct: '0.25',
      R1: (base+100).toFixed(0),
      R2: (base+200).toFixed(0),
      S1: (base-100).toFixed(0),
      S2: (base-200).toFixed(0),
      live: false,
      error: err.message
    });
  }
}
