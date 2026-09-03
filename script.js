
const $ = id=>document.getElementById(id);
function sugg(price,diff){
  if(diff>80) return {a:"🚀 BUY CE STRONG", t:"KONUKKOVACHU!", c:"#00ff88"};
  if(diff>20) return {a:"📈 BUY KONAVACHU", t:"Dip lo konandi!", c:"#88ff88"};
  if(diff>-20) return {a:"⏸️ WAIT AAGANDI", t:"Aagandi bro", c:"#ffaa00"};
  if(diff>-80) return {a:"⚠️ SELL AMMAKOCHU", t:"PE konavachu", c:"#ff8855"};
  return {a:"🔻 STRONG SELL", t:"AMMAKOVACHU PE KONANDI!", c:"#ff4444"};
}
async function fetchYahoo(symbol){
  const y=`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
  const prox=[`https://api.allorigins.win/raw?url=${encodeURIComponent(y)}`,`https://corsproxy.io/?${encodeURIComponent(y)}`];
  for(let u of prox){ try{ const r=await fetch(u,{cache:"no-store"}); const d=await r.json(); if(d.chart?.result?.[0]?.meta?.regularMarketPrice) return d.chart.result[0].meta; }catch(e){} }
  return null;
}
async function fetchOptionChain(){
  // NSE option chain via proxy
  const url = 'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY';
  const prox = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  try{
    const r = await fetch(prox, {headers:{'User-Agent':'Mozilla'}});
    const d = await r.json();
    if(d.records?.data) return d.records.data;
  }catch(e){}
  return null;
}
async function updateAll(){
  const nMeta = await fetchYahoo('%5ENSEI');
  const bMeta = await fetchYahoo('%5ENSEBANK');
  const sMeta = await fetchYahoo('%5EBSESN');
  if(!nMeta){
    $('nifty').textContent="Market Closed"; $('nifty-change').textContent="Repu 9:15 REAL chain vastundi";
    $('trade-hint').textContent="⏸️ MARKET CLOSED - REPU 9:15 OPTION CHAIN LIVE"; $('trade-hint').style.background="#ffaa00";
    $('hint-telugu').innerHTML="Market close bro - repu 9:15 ki CALL vs PUT + Gamma Blast + Zero to Hero motham REAL vastayi!";
    $('banknifty').textContent="Closed"; $('sensex').textContent="Closed";
    // demo option chain for preview
    const demo = [
      {strike:24400, ce:12, ceCh:15, pe:89, peCh:-8, ceOI:'12L', peOI:'18L'},
      {strike:24450, ce:22, ceCh:25, pe:65, peCh:-12, ceOI:'15L', peOI:'20L'},
      {strike:24500, ce:45, ceCh:40, pe:42, peCh:-20, ceOI:'22L', peOI:'25L', atm:true},
      {strike:24550, ce:78, ceCh:30, pe:25, peCh:-15, ceOI:'18L', peOI:'14L'},
      {strike:24600, ce:120, ceCh:18, pe:15, peCh:-10, ceOI:'10L', peOI:'8L'},
    ];
    let html=''; demo.forEach(r=>{
      html+=`<tr style="${r.atm?'background:rgba(0,255,136,0.1);font-weight:bold':''}"><td>${r.ceOI}</td><td class="call">₹${r.ce}</td><td style="color:${r.ceCh>0?'#00ff88':'#ff4444'}">${r.ceCh}%</td><td style="font-weight:bold">${r.strike}${r.atm?' ⭐ATM':''}</td><td style="color:${r.peCh>0?'#00ff88':'#ff4444'}">${r.peCh}%</td><td class="put">₹${r.pe}</td><td>${r.peOI}</td></tr>`;
    });
    $('option-chain-body').innerHTML=html;
    $('pcr-live').textContent="PCR: 1.18 (Preview)"; $('call-bar').style.width="55%"; $('put-bar').style.width="45%"; $('call-pct').textContent="CALL 55%"; $('put-pct').textContent="PUT 45%";
    $('zero-hero').innerHTML=`<b>Repu Live Preview:</b><br>Nifty 24600 CE: ₹15 → ₹60 (4x)<br>Nifty 24400 PE: ₹18 → ₹70 (3.8x)<br>Sensex 80000 CE: ₹8 → ₹40<br><br><span style="color:#ffaa00">Risk ₹2000 per lot, SL 0</span>`;
    return;
  }
  // NIFTY
  let p=nMeta.regularMarketPrice, pr=nMeta.previousClose, d=p-pr, pct=(d/pr*100).toFixed(2), s=sugg(p,d);
  $('nifty').textContent=p.toFixed(2); $('nifty-change').textContent=`${d>=0?'+':''}${d.toFixed(2)} (${pct}%)`; $('nifty').style.color=s.c;
  $('trade-hint').textContent=s.a; $('trade-hint').style.background=s.c; $('hint-telugu').textContent=s.t;
  $('nifty-spot').textContent=p.toFixed(0);

  // BANK
  if(bMeta){ $('banknifty').textContent=bMeta.regularMarketPrice.toFixed(2); $('banknifty-change').textContent=(bMeta.regularMarketPrice-bMeta.previousClose).toFixed(2); }
  if(sMeta){ $('sensex').textContent=sMeta.regularMarketPrice.toFixed(2); $('sensex-change').textContent=(sMeta.regularMarketPrice-sMeta.previousClose).toFixed(2); $('sensex-spot').textContent=sMeta.regularMarketPrice.toFixed(0); }

  // OPTION CHAIN REAL attempt
  const chain = await fetchOptionChain();
  if(chain){
    let atm = Math.round(p/50)*50;
    let filtered = chain.filter(x=> Math.abs(x.strikePrice-atm)<=250).slice(0,8);
    let html='', totalCall=0,totalPut=0;
    filtered.forEach(o=>{
      let ce=o.CE, pe=o.PE; if(!ce||!pe) return;
      totalCall+=ce.openInterest||0; totalPut+=pe.openInterest||0;
      let gamma = (ce.openInterest>1000000 || pe.openInterest>1000000) ? 'gamma-high' : '';
      html+=`<tr class="${gamma}"><td>${(ce.openInterest/100000).toFixed(1)}L</td><td class="call">₹${ce.lastPrice}</td><td style="color:${ce.change>0?'#0f8':'#f44'}">${ce.pChange?.toFixed(1)}%</td><td><b>${o.strikePrice}${o.strikePrice==atm?' ⭐':''}</b></td><td style="color:${pe.change>0?'#0f8':'#f44'}">${pe.pChange?.toFixed(1)}%</td><td class="put">₹${pe.lastPrice}</td><td>${(pe.openInterest/100000).toFixed(1)}L</td></tr>`;
    });
    $('option-chain-body').innerHTML=html||'<tr><td colspan=7>Chain loading...</td></tr>';
    let pcr = totalPut>0? (totalPut/totalCall).toFixed(2):'1.18';
    $('pcr-live').textContent=`PCR: ${pcr} ${pcr>1?'Bullish':pcr<0.8?'Bearish':'Neutral'}`;
    let total=totalCall+totalPut; $('call-bar').style.width=(totalCall/total*100)+'%'; $('put-bar').style.width=(totalPut/total*100)+'%';
    $('call-pct').textContent=`CALL ${(totalCall/total*100).toFixed(0)}%`; $('put-pct').textContent=`PUT ${(totalPut/total*100).toFixed(0)}%`;
    // Gamma Blast
    let blastStrike = filtered.find(x=> (x.CE?.openInterest>1500000 || x.PE?.openInterest>1500000));
    if(blastStrike){
      $('gamma-text').innerHTML=`<b style="color:#ff4444">💥 BLAST at ${blastStrike.strikePrice}!</b><br>OI 15L+ cross ayindi! Breakout vastundi bro! ${blastStrike.strikePrice} CE/PE chudu!<br><small>KONUKKOVACHU - Gamma 0.12</small>`;
    }
  } else {
    // Yahoo options fallback for premiums
    $('pcr-live').textContent="PCR: Live NSE blocked - Yahoo premiums chupistunna";
  }

  // Zero to Hero real premiums
  // Use Yahoo options for Nifty near expiry
  try{
    const optUrl = `https://query1.finance.yahoo.com/v7/finance/options/%5ENSEI`;
    const prox = `https://api.allorigins.win/raw?url=${encodeURIComponent(optUrl)}`;
    const r = await fetch(prox); const d=await r.json();
    const opts = d.optionChain?.result?.[0]?.options?.[0];
    if(opts){
      const calls = opts.calls?.slice(0,5)||[]; const puts = opts.puts?.slice(0,5)||[];
      let zh = '<b>Zero to Hero REAL:</b><br>';
      calls.filter(c=>c.lastPrice<20).forEach(c=>{ zh+=`Nifty ${c.strike} CE: ₹${c.lastPrice} → Target ₹${(c.lastPrice*4).toFixed(0)}<br>`; });
      puts.filter(p=>p.lastPrice<20).forEach(p=>{ zh+=`Nifty ${p.strike} PE: ₹${p.lastPrice} → Target ₹${(p.lastPrice*4).toFixed(0)}<br>`; });
      $('zero-hero').innerHTML=zh;
    }
  }catch(e){}
}

async function doSearch(){
  const q=$('searchInput').value.trim(); if(!q) return;
  const strike = parseInt(q);
  if(!isNaN(strike)){
    // highlight strike in chain
    const rows=document.querySelectorAll('#option-chain-body tr');
    rows.forEach(r=>{ if(r.textContent.includes(q)) r.style.background='rgba(0,255,136,0.2)'; });
    $('searchResult').innerHTML=`<b>${strike} Strike:</b><br>CE/PE premiums chain lo highlight chesa bro!`;
    return;
  }
  $('searchResult').textContent="Strike number type chey: 24500";
}
$('searchBtn').addEventListener('click', doSearch);
$('searchInput').addEventListener('keypress', e=>{ if(e.key==='Enter') doSearch(); });
updateAll();
setInterval(updateAll, 8000);
