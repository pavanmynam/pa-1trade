const niftyEl = document.getElementById('nifty');
const changeEl = document.getElementById('nifty-change');
const hintEl = document.getElementById('trade-hint');
const hintTeluguEl = document.getElementById('hint-telugu');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResult = document.getElementById('searchResult');
let last = 24521;

function getTradeSuggestion(price, diff){
  let action="", telugu="", color="";
  if(diff > 80){
    action = "🚀 BUY CE - STRONG";
    telugu = "KONUKKOVACHU BRO! Market baga perugutundi. 24500 CE konavachu. SL: "+(price-60).toFixed(0);
    color = "#00ff88";
  } else if(diff > 20){
    action = "📈 BUY - KONAVACHU";
    telugu = "Kontha konavachu, dip vasthe konandi. Target 24,650. Risk 1% only!";
    color = "#88ff88";
  } else if(diff > -20){
    action = "⏸️ WAIT - AAGANDI";
    telugu = "Ippudu aagandi bro, market clear ga ledu. Confirm ayyaka enter avvandi.";
    color = "#ffaa00";
  } else if(diff > -80){
    action = "⚠️ SELL - AMMAKOCHU";
    telugu = "Market padutundi, CE lu ammakovachu, PE konavachu. 24400 PE chudandi.";
    color = "#ff8855";
  } else {
    action = "🔻 STRONG SELL - PE KONANDI";
    telugu = "AMMAKOVACHU! Market padipotundi. PE konandi, CE joliki vellakandi!";
    color = "#ff4444";
  }
  return {action, telugu, color};
}

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
    const sugg = getTradeSuggestion(price, diff);
    niftyEl.textContent = price.toFixed(2);
    changeEl.innerHTML = (diff>=0?'+':'')+diff.toFixed(2)+' ('+pct+'%)';
    niftyEl.style.color = sugg.color;
    changeEl.style.color = sugg.color;
    hintEl.textContent = sugg.action;
    hintEl.style.background = sugg.color;
    hintEl.style.color = '#000';
    hintTeluguEl.innerHTML = '<b>'+sugg.action+'</b><br>'+sugg.telugu+'<br><small>Entry: '+price.toFixed(0)+' | SL: '+(price-50).toFixed(0)+' | Target: '+(price+80).toFixed(0)+'</small>';
    hintTeluguEl.style.borderColor = sugg.color;
    last = price;
  }catch(e){
    last += (Math.random()-0.5)*5;
    niftyEl.textContent = last.toFixed(2);
  }
}

async function doSearch(){
  const q = searchInput.value.trim().toUpperCase();
  if(!q){ searchResult.textContent = 'Stock name type chey! Eg: RELIANCE'; return; }
  searchResult.innerHTML = 'Searching '+q+'...';
  const map = {'NIFTY':'%5ENSEI','BANKNIFTY':'%5ENSEBANK','RELIANCE':'RELIANCE.NS','TCS':'TCS.NS','INFY':'INFY.NS'};
  const symbol = map[q] || q+'.NS';
  try{
    const url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/'+symbol+'?interval=1m&range=1d');
    const res = await fetch(url);
    const data = await res.json();
    const meta = data.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const prev = meta.previousClose;
    const diff = price-prev;
    const pct = (diff/prev*100).toFixed(2);
    const sugg = getTradeSuggestion(price, diff);
    searchResult.innerHTML = '<b>'+q+'</b>: ₹'+price.toFixed(2)+' ('+pct+'%)<br><br><b style="color:'+sugg.color+'">'+sugg.action+'</b><br>'+sugg.telugu;
  }catch(e){
    searchResult.innerHTML = q+' dorakaledu, RELIANCE, TCS type chey bro';
  }
}
searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keypress', (e)=>{ if(e.key==='Enter') doSearch(); });
liveNifty();
setInterval(liveNifty, 5000);
