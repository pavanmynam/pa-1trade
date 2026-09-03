const niftyEl = document.getElementById('nifty');
const changeEl = document.getElementById('nifty-change');
let last = 24521;
async function liveNifty(){
  try{
    const url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1m&range=1d');
    const res = await fetch(url);
    const data = await res.json();
    const meta = data.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const prev = meta.previousClose;
    const diff = price - prev;
    const pct = (diff/prev*100).toFixed(2);
    niftyEl.textContent = price.toFixed(2);
    changeEl.textContent = (diff>=0?'+':'')+diff.toFixed(2)+' ('+(diff>=0?'+':'')+pct+'%)';
    changeEl.style.color = diff>=0? '#00ff88' : '#ff5555';
    niftyEl.style.color = diff>=0? '#00ff88' : '#ff5555';
    document.title = 'NIFTY '+price.toFixed(2)+' | PA1 BUDDY';
    last = price;
  }catch(e){
    last += (Math.random()-0.5)*5;
    niftyEl.textContent = last.toFixed(2) + ' (demo)';
  }
}
liveNifty();
setInterval(liveNifty, 5000);
