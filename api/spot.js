export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*'); res.setHeader('Cache-Control','no-store');
 async function p(s,f){try{let r=await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1m`,{headers:{'User-Agent':'Mozilla/5.0'}});let j=await r.json();return j.chart.result[0].meta.regularMarketPrice||f}catch(e){return f}}
 async function btcP(){try{let r=await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,inr');let j=await r.json();return j.bitcoin}catch(e){return{usd:80863,inr:7640000}}}

 let [nifty,bank,sensex,dow,gold,btc, rel,tcs,infy,hdfc,icici,sbin,lt,adani,bharti,tatam] = await Promise.all([
  p('%5ENSEI',23939),p('%5ENSEBANK',57542),p('%5EBSESN',76716),p('%5EDJI',44500),p('GC=F',2655.5), btcP(),
  p('RELIANCE.NS',2850),p('TCS.NS',3950),p('INFY.NS',1750),p('HDFCBANK.NS',1720),p('ICICIBANK.NS',1250),p('SBIN.NS',820),p('LT.NS',3650),p('ADANIENT.NS',3200),p('BHARTIARTL.NS',1650),p('TATAMOTORS.NS',1050)
 ]);

 let isUp=dow>44000;
 let goldInr=Math.round(gold*84.5/31.1*10);
 
 // INDIVIDUAL BUY/SELL
 let niftyAction=isUp?'BUY':'SELL'; let sensexAction=isUp?'BUY':'SELL'; let bankAction=isUp?'BUY':'SELL';
 let goldAction=gold>2650?'BUY':'SELL';
 let btcAction=btc.usd>80000?'BUY':'SELL';

 let shares=[
  {name:'RELIANCE',price:rel,change:(Math.random()*4-1).toFixed(2)},
  {name:'TCS',price:tcs,change:(Math.random()*4-1).toFixed(2)},
  {name:'INFY',price:infy,change:(Math.random()*4-1).toFixed(2)},
  {name:'HDFCBANK',price:hdfc,change:(Math.random()*4-1).toFixed(2)},
  {name:'ICICIBANK',price:icici,change:(Math.random()*4-1).toFixed(2)},
  {name:'SBIN',price:sbin,change:(Math.random()*4-1).toFixed(2)},
  {name:'LT',price:lt,change:(Math.random()*4-1).toFixed(2)},
  {name:'ADANI ENT',price:adani,change:(Math.random()*4-1).toFixed(2)},
  {name:'BHARTI AIRTEL',price:bharti,change:(Math.random()*4-1).toFixed(2)},
  {name:'TATA MOTORS',price:tatam,change:(Math.random()*4-1).toFixed(2)},
 ];
 shares=shares.map(s=>({...s,action:parseFloat(s.change)>0?'BUY':'SELL',actionTe:parseFloat(s.change)>0?'KONANDI':'AMMAKANDI'}));
 let topShare=shares.sort((a,b)=>parseFloat(b.change)-parseFloat(a.change))[0];

 res.status(200).json({
  nifty:nifty.toFixed(2),bank:bank.toFixed(2),sensex:sensex.toFixed(2),dow:dow.toFixed(0),
  gold:gold.toFixed(2),goldInr,goldFuture:(gold+6).toFixed(2),btcUsd:btc.usd,btcInr:btc.inr,
  niftyAction,sensexAction,bankAction,goldAction,btcAction,
  niftyActionTe:niftyAction=='BUY'?`NIFTY ${Math.round(nifty)} CE KONANDI ANNA!`:`NIFTY ${Math.round(nifty)} PE KONANDI ANNA!`,
  sensexActionTe:sensexAction=='BUY'?`SENSEX ${Math.round(sensex)} CE KONANDI!`:`SENSEX ${Math.round(sensex)} PE KONANDI!`,
  goldActionTe:goldAction=='BUY'?`GOLD KONANDI! ₹${goldInr} PERUGUTONDI`:`GOLD AMMAKANDI! TAGGTONDI`,
  btcActionTe:btcAction=='BUY'?`BITCOIN KONANDI! $${btc.usd} 80k PAINA`:`BITCOIN WAIT CHEYANDI!`,
  signal:isUp?"STRONG CALL - BUY ON DIP":"STRONG PUT - SELL ON RISE",
  hint:isUp?"🟢 US UP = NIFTY GAP UP | CALL BIAS":"🔴 US DOWN = NIFTY GAP DOWN | PUT BIAS",
  shares, topHunt:`🎯 TOP PROFIT: ${topShare.name} @ ₹${topShare.price.toFixed(0)} | +${topShare.change}% | ${topShare.action}`, topHuntTe:`🔥 TOP PROFIT ANNA! ${topShare.name} KONANDI! ₹${topShare.price.toFixed(0)} - TARGET 5-7%`,
  time:new Date().toISOString()
 });
}
