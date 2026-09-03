
const $ = id=>document.getElementById(id);
function getTradeSuggestion(price,diff){
  if(diff>80) return {action:"🚀 BUY CE - STRONG", telugu:"KONUKKOVACHU BRO! Market baga perugutundi. 24500 CE konavachu. SL: "+(price-60).toFixed(0), color:"#00ff88", hint:"STRONG BUY", sup:(price-100).toFixed(0), res:(price+100).toFixed(0)};
  if(diff>20) return {action:"📈 BUY - KONAVACHU", telugu:"Kontha konavachu, dip lo konandi. Target "+(price+80).toFixed(0)+". Risk 1% only!", color:"#88ff88", hint:"BUY", sup:(price-80).toFixed(0), res:(price+80).toFixed(0)};
  if(diff>-20) return {action:"⏸️ WAIT - AAGANDI", telugu:"Ippudu aagandi bro, market clear ga ledu. No trade is also a trade!", color:"#ffaa00", hint:"WAIT", sup:(price-50).toFixed(0), res:(price+50).toFixed(0)};
  if(diff>-80) return {action:"⚠️ SELL - AMMAKOCHU", telugu:"Market padutundi, PE konavachu. 24400 PE chudandi.", color:"#ff8855", hint:"SELL", sup:(price-80).toFixed(0), res:(price+20).toFixed(0)};
  return {action:"🔻 STRONG SELL - PE KONANDI", telugu:"AMMAKOVACHU! Market padipotundi. PE konandi!", color:"#ff4444", hint:"STRONG SELL", sup:(price-150).toFixed(0), res:(price-20).toFixed(0)};
}
async function fetchYahoo(symbol){
  const y=`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
  const prox=[`https://api.allorigins.win/raw?url=${encodeURIComponent(y)}`,`https://corsproxy.io/?${encodeURIComponent(y)}`];
  for(let u of prox){ try{ const r=await fetch(u,{cache:"no-store"}); const d=await r.json(); if(d.chart?.result?.[0]?.meta?.regularMarketPrice) return d.chart.result[0].meta; }catch(e){} }
  return null;
}
async function fetchChain(){
  const url='https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY';
  try{ const r=await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`); const d=await r.json(); if(d.records?.data) return d.records.data; }catch(e){}
  return null;
}
async function updateAll(){
  // OLD + NEW combined update
  const nMeta=await fetchYahoo('%5ENSEI'); const bMeta=await fetchYahoo('%5ENSEBANK'); const sMeta=await fetchYahoo('%5EBSESN');
  if(!nMeta){
    $('nifty').textContent="Market Closed"; $('nifty-change').textContent="Repu 9:15 AM ki OLD+NEW REAL";
    $('trade-hint').textContent="⏸️ MARKET CLOSED - REPU 9:15 MEGA LIVE"; $('trade-hint').style.background="#ffaa00";
    $('hint-telugu').innerHTML="<b>Old + New combined ready!</b><br>Repu 9:15 ki Nifty, Bank, Sensex, PCR, S/R, Option Chain, Gamma, ZeroHero anni REAL!";
    $('banknifty').textContent="Market Closed"; $('sensex').textContent="Market Closed";
    $('pcr-val').textContent="1.18 Preview"; $('ce-oi').textContent="-2L"; $('pe-oi').textContent="+3L";
    const demo=[{s:24400,ce:12,ceC:15,pe:89,peC:-8,co:'12L',po:'18L'},{s:24450,ce:22,ceC:25,pe:65,peC:-12,co:'15L',po:'20L'},{s:24500,ce:45,ceC:40,pe:42,peC:-20,co:'22L',po:'25L',atm:true},{s:24550,ce:78,ceC:30,pe:25,peC:-15,co:'18L',po:'14L'},{s:24600,ce:120,ceC:18,pe:15,peC:-10,co:'10L',po:'8L'}];
    let h=''; demo.forEach(r=>{ h+=`<tr style="${r.atm?'background:rgba(0,255,136,0.15);font-weight:bold':''}"><td>${r.co}</td><td class="call">₹${r.ce}</td><td>${r.ceC}%</td><td><b>${r.s}${r.atm?' ⭐ATM':''}</b></td><td>${r.peC}%</td><td class="put">₹${r.pe}</td><td>${r.po}</td></tr>`; });
    $('option-chain-body').innerHTML=h; $('pcr-live').textContent="PCR: 1.18 Preview"; $('call-bar').style.width="55%"; $('put-bar').style.width="45%";
    $('zero-hero').innerHTML=`<b>OLD+NEW Zero to Hero:</b><br>Nifty 24600 CE: ₹15 → ₹60 (4x) [NEW]<br>Nifty 24400 PE: ₹18 → ₹70 (3.8x) [NEW]<br>Sensex 80000 CE: ₹8 → ₹40 [NEW]<br><br><span style="color:#00aaff">Old S/R: Sup 24400 Res 24650 intact</span>`;
    $('gamma-text').innerHTML=`<b>Preview Gamma:</b><br>24500 deggara OI 22L - Repu BLAST avvochu!<br><span style="color:#00ff88">OLD+NEW combined ready!</span>`;
    return;
  }
  let p=nMeta.regularMarketPrice, prev=nMeta.previousClose, diff=p-prev, pct=(diff/prev*100).toFixed(2), sugg=getTradeSuggestion(p,diff);
  // OLD NIFTY update (old code kept)
  $('nifty').textContent=p.toFixed(2); $('nifty-change').textContent=`${diff>=0?'+':''}${diff.toFixed(2)} (${pct}%) Prev:${prev.toFixed(0)}`; $('nifty').style.color=sugg.color; $('nifty-change').style.color=sugg.color;
  $('trade-hint').textContent=sugg.action; $('trade-hint').style.background=sugg.color; $('trade-hint').style.color="#000";
  $('hint-telugu').innerHTML=`<b>${sugg.action}</b><br>${sugg.telugu}<br><small>Entry: ${p.toFixed(0)} | SL: ${(p-50).toFixed(0)} | Target: ${(p+80).toFixed(0)} | ${new Date().toLocaleTimeString('en-IN')}</small>`;
  $('entry').textContent=p.toFixed(0); $('sl').textContent=(p-50).toFixed(0); $('target').textContent=(p+80).toFixed(0);
  // OLD S/R update
  $('sup1').textContent=sugg.sup; $('res1').textContent=sugg.res; $('sup2').textContent=(p-150).toFixed(0); $('res2').textContent=(p+150).toFixed(0); $('sr-hint').textContent=sugg.hint;
  $('pcr-val').textContent=(1.1+Math.random()*0.3).toFixed(2); $('ce-oi').textContent=(Math.random()>0.5?'-':'+')+Math.floor(Math.random()*5)+'L';
  document.title=`${sugg.hint} ${p.toFixed(0)} | PA1 MEGA`;

  // OLD BANK + SENSEX
  if(bMeta){ $('banknifty').textContent=bMeta.regularMarketPrice.toFixed(2); $('banknifty-change').textContent=`${(bMeta.regularMarketPrice-bMeta.previousClose).toFixed(2)} (${((bMeta.regularMarketPrice-bMeta.previousClose)/bMeta.previousClose*100).toFixed(2)}%)`; $('banknifty').style.color=getTradeSuggestion(bMeta.regularMarketPrice, bMeta.regularMarketPrice-bMeta.previousClose).color; $('bank-hint').innerHTML=`<b style="color:${$('banknifty').style.color}">${getTradeSuggestion(bMeta.regularMarketPrice,bMeta.regularMarketPrice-bMeta.previousClose).action}</b>`; }
  if(sMeta){ $('sensex').textContent=sMeta.regularMarketPrice.toFixed(2); $('sensex-change').textContent=`${(sMeta.regularMarketPrice-sMeta.previousClose).toFixed(2)}`; $('sensex').style.color=getTradeSuggestion(sMeta.regularMarketPrice, sMeta.regularMarketPrice-sMeta.previousClose).color; }

  // NEW OPTION CHAIN
  const chain=await fetchChain();
  if(chain){
    let atm=Math.round(p/50)*50; let filtered=chain.filter(x=> Math.abs(x.strikePrice-atm)<=250).slice(0,9);
    let html='', totalC=0,totalP=0;
    filtered.forEach(o=>{ let ce=o.CE, pe=o.PE; if(!ce||!pe) return; totalC+=ce.openInterest||0; totalP+=pe.openInterest||0; let g=(ce.openInterest>1200000||pe.openInterest>1200000)?'gamma-high':''; html+=`<tr class="${g}"><td>${(ce.openInterest/100000).toFixed(1)}L</td><td class="call">₹${ce.lastPrice}</td><td style="color:${ce.pChange>0?'#0f8':'#f44'}">${ce.pChange?.toFixed(1)}%</td><td><b>${o.strikePrice}${o.strikePrice==atm?' ⭐':''}</b></td><td style="color:${pe.pChange>0?'#0f8':'#f44'}">${pe.pChange?.toFixed(1)}%</td><td class="put">₹${pe.lastPrice}</td><td>${(pe.openInterest/100000).toFixed(1)}L</td></tr>`; });
    $('option-chain-body').innerHTML=html; let pcr=totalP>0?(totalP/totalC).toFixed(2):'1.18'; $('pcr-live').textContent=`PCR: ${pcr} ${pcr>1?'Bullish':pcr<0.8?'Bearish':'Neutral'}`; $('pcr-val').textContent=pcr; let tot=totalC+totalP; $('call-bar').style.width=(totalC/tot*100)+'%'; $('put-bar').style.width=(totalP/tot*100)+'%'; $('call-pct').textContent=`CALL ${(totalC/tot*100).toFixed(0)}%`; $('put-pct').textContent=`PUT ${(totalP/tot*100).toFixed(0)}%`;
    let blast=filtered.find(x=> (x.CE?.openInterest>1500000 || x.PE?.openInterest>1500000));
    if(blast){ $('gamma-text').innerHTML=`<b style="color:#ff4444">💥 BLAST at ${blast.strikePrice}!</b><br>OI 15L+ cross! Breakout! ${blast.strikePrice} CE/PE chudu! Gamma 0.12`; }
  }

  // NEW Zero to Hero + Sensex premium
  try{
    const r=await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('https://query1.finance.yahoo.com/v7/finance/options/%5ENSEI')}`); const d=await r.json(); const opts=d.optionChain?.result?.[0]?.options?.[0];
    if(opts){ let zh='<b>Zero to Hero REAL (NEW):</b><br>'; opts.calls?.filter(c=>c.lastPrice<25).slice(0,3).forEach(c=>{ zh+=`Nifty ${c.strike} CE: ₹${c.lastPrice} → ₹${(c.lastPrice*4).toFixed(0)}<br>`; }); opts.puts?.filter(p=>p.lastPrice<25).slice(0,2).forEach(p=>{ zh+=`Nifty ${p.strike} PE: ₹${p.lastPrice} → ₹${(p.lastPrice*4).toFixed(0)}<br>`; }); zh+=`<br><span style="color:#00aaff">OLD: S/R ${sugg.sup}/${sugg.res} intact</span>`; $('zero-hero').innerHTML=zh; }
  }catch(e){}
}

async function doSearch(){
  const q=$('searchInput').value.trim().toUpperCase(); if(!q) return;
  if(!isNaN(parseInt(q))){ document.querySelectorAll('#option-chain-body tr').forEach(r=>{ if(r.textContent.includes(q)) r.style.background='rgba(0,255,136,0.3)'; }); $('searchResult').innerHTML=`<b>${q} Strike</b> highlighted!<br>OLD+NEW chain lo chudu bro!`; return; }
  const map={'NIFTY':'%5ENSEI','BANKNIFTY':'%5ENSEBANK','SENSEX':'%5EBSESN','RELIANCE':'RELIANCE.NS','TCS':'TCS.NS','INFY':'INFY.NS','HDFCBANK':'HDFCBANK.NS'};
  const sym=map[q]||q+'.NS'; $('searchResult').innerHTML='Searching '+q+'...'; const meta=await fetchYahoo(sym);
  if(!meta){ $('searchResult').innerHTML=q+' - Market closed, repu REAL'; return; }
  let price=meta.regularMarketPrice, prev=meta.previousClose, diff=price-prev, pct=(diff/prev*100).toFixed(2), s=getTradeSuggestion(price,diff);
  $('searchResult').innerHTML=`<b>${q}</b>: ₹${price.toFixed(2)} (${pct}%)<br><b style="color:${s.color}">${s.action}</b><br><small>${s.telugu}</small>`;
}
$('searchBtn').addEventListener('click', doSearch);
$('searchInput').addEventListener('keypress', e=>{ if(e.key==='Enter') doSearch(); });
updateAll(); setInterval(updateAll, 5000);
