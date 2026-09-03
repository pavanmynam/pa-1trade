const niftyEl = document.getElementById('nifty');
const changeEl = document.getElementById('nifty-change');
const hintEl = document.getElementById('trade-hint');
const hintTeluguEl = document.getElementById('hint-telugu');
const bankEl = document.getElementById('banknifty');
const bankChangeEl = document.getElementById('banknifty-change');
const bankHintEl = document.getElementById('bank-hint');
const sensexEl = document.getElementById('sensex');
const sensexChangeEl = document.getElementById('sensex-change');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResult = document.getElementById('searchResult');

function getTradeSuggestion(price, diff){
  if(diff > 80) return {action:"🚀 BUY CE - STRONG", telugu:"KONUKKOVACHU BRO! CE konavachu.", color:"#00ff88", hint:"STRONG BUY"};
  if(diff > 20) return {action:"📈 BUY - KONAVACHU", telugu:"Kontha konavachu, dip lo konandi!", color:"#88ff88", hint:"BUY"};
  if(diff > -20) return {action:"⏸️ WAIT - AAGANDI", telugu:"Aagandi bro, clear ga ledu.", color:"#ffaa00", hint:"WAIT"};
  if(diff > -80) return {action:"⚠️ SELL - AMMAKOCHU", telugu:"PE konavachu, CE ammeyandi.", color:"#ff8855", hint:"SELL"};
  return {action:"🔻 STRONG SELL", telugu:"AMMAKOVACHU! PE konandi!", color:"#ff4444", hint:"STRONG SELL"};
}

async function fetchReal(symbol){
  const yUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(yUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(yUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(yUrl)}`
  ];
  for(let u of proxies){
    try{
      const r = await fetch(u, {cache:"no-store"});
      const d = await r.json();
      if(d.chart?.result?.[0]?.meta?.regularMarketPrice) return d.chart.result[0].meta;
    }catch(e){ continue; }
  }
  return null;
}

async function updateAll(){
  const niftyMeta = await fetchReal('%5ENSEI');
  if(!niftyMeta){
    niftyEl.textContent = "Market Closed";
    changeEl.textContent = "Repu 9:15 AM ki REAL LIVE";
    hintEl.textContent = "⏸️ MARKET CLOSED - REPU 9:15";
    hintEl.style.background="#ffaa00"; hintEl.style.color="#000";
    hintTeluguEl.innerHTML="<b>Market close ayindi</b><br>Repu 9:15 ki auto REAL vastundi!";
    bankEl.textContent="Market Closed"; sensexEl.textContent="Market Closed";
    return;
  }
  let price = niftyMeta.regularMarketPrice; let prev=niftyMeta.previousClose; let diff=price-prev; let pct=(diff/prev*100).toFixed(2);
  let sugg=getTradeSuggestion(price,diff);
  niftyEl.textContent=price.toFixed(2); changeEl.textContent=`${diff>=0?'+':''}${diff.toFixed(2)} (${pct}%)`; niftyEl.style.color=sugg.color; changeEl.style.color=sugg.color;
  hintEl.textContent=sugg.action; hintEl.style.background=sugg.color; hintEl.style.color="#000";
  hintTeluguEl.innerHTML=`<b>${sugg.action}</b><br>${sugg.telugu}<br><small>Entry:${price.toFixed(0)} SL:${(price-50).toFixed(0)} Target:${(price+80).toFixed(0)}</small>`;
  document.title=`${sugg.hint} ${price.toFixed(0)} | PA1`;

  const bankMeta = await fetchReal('%5ENSEBANK');
  if(bankMeta){
    let bp=bankMeta.regularMarketPrice; let bprev=bankMeta.previousClose; let bdiff=bp-bprev; let bpct=(bdiff/bprev*100).toFixed(2);
    let bsugg=getTradeSuggestion(bp,bdiff);
    bankEl.textContent=bp.toFixed(2); bankChangeEl.textContent=`${bdiff>=0?'+':''}${bdiff.toFixed(2)} (${bpct}%)`; bankEl.style.color=bsugg.color;
    bankHintEl.innerHTML=`<b style="color:${bsugg.color}">${bsugg.action}</b><br><small>${bsugg.telugu}</small>`;
  }

  const sensexMeta = await fetchReal('%5EBSESN');
  if(sensexMeta){
    let sp=sensexMeta.regularMarketPrice; let sprev=sensexMeta.previousClose; let sdiff=sp-sprev; let spct=(sdiff/sprev*100).toFixed(2);
    sensexEl.textContent=sp.toFixed(2); sensexChangeEl.textContent=`${sdiff>=0?'+':''}${sdiff.toFixed(2)} (${spct}%)`; sensexEl.style.color=getTradeSuggestion(sp,sdiff).color;
  }
}

async function doSearch(){
  const q=searchInput.value.trim().toUpperCase(); if(!q) return;
  searchResult.innerHTML="Searching "+q+"...";
  const map={'NIFTY':'%5ENSEI','BANKNIFTY':'%5ENSEBANK','SENSEX':'%5EBSESN','RELIANCE':'RELIANCE.NS','TCS':'TCS.NS','INFY':'INFY.NS'};
  const sym=map[q]||q+'.NS';
  const meta=await fetchReal(sym);
  if(!meta){ searchResult.innerHTML=q+" - Market closed, repu 9:15 ki REAL"; return; }
  let p=meta.regularMarketPrice; let pr=meta.previousClose; let d=p-pr; let pct=(d/pr*100).toFixed(2); let s=getTradeSuggestion(p,d);
  searchResult.innerHTML=`<b>${q}</b>: ₹${p.toFixed(2)} (${pct}%)<br><b style="color:${s.color}">${s.action}</b><br><small>${s.telugu}</small>`;
}

searchBtn?.addEventListener('click', doSearch);
searchInput?.addEventListener('keypress', e=>{ if(e.key==='Enter') doSearch(); });
updateAll();
setInterval(updateAll, 5000);
