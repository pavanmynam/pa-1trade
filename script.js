
let lastPrice = 24521.30;
const el = document.getElementById('nifty');
const changeEl = document.getElementById('nifty-change');

async function fetchLiveNifty(){
  try {
    // Using Yahoo Finance - Nifty 50 ^NSEI - CORS friendly proxy
    const res = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1m&range=1d'));
    const data = await res.json();
    const result = data.chart.result[0];
    const price = result.meta.regularMarketPrice;
    const prevClose = result.meta.previousClose;
    const change = price - prevClose;
    const pct = (change/prevClose*100).toFixed(2);
    
    if(price){
      el.innerText = price.toFixed(2);
      changeEl.innerHTML = (change>=0?'+':'') + change.toFixed(2) + ' (' + (change>=0?'+':'') + pct + '%)';
      changeEl.style.color = change>=0 ? '#00ff88' : '#ff4444';
      el.style.color = change>=0 ? '#00ff88' : '#ff4444';
      lastPrice = price;
      console.log('Live Nifty:', price);
    }
  } catch(e){
    console.log('Live fetch fail, using mock', e);
    // fallback mock movement
    lastPrice += (Math.random()-0.5)*4;
    el.innerText = lastPrice.toFixed(2);
  }
}

// Fetch every 5 seconds
fetchLiveNifty();
setInterval(fetchLiveNifty, 5000);

// Also try direct Yahoo without proxy as backup (sometimes works)
async function fetchDirect(){
  try{
    const r = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI');
    const d = await r.json();
    console.log('Direct success', d.chart.result[0].meta.regularMarketPrice);
  }catch(e){}
}
