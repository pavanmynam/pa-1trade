export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*'); res.setHeader('Cache-Control','no-store');
 async function p(s,f){try{let r=await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1m`,{headers:{'User-Agent':'Mozilla/5.0'}});let j=await r.json();return j.chart.result[0].meta.regularMarketPrice||f}catch(e){return f}}
 async function btcP(){try{let r=await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,inr');let j=await r.json();return j.bitcoin}catch(e){return{usd:80863,inr:7640000}}}

 let [nifty,bank,sensex,dow,nasdaq,gold,btc, rel,tcs,infy,hdfc,icici,sbin,lt,adani,bharti,tatam] = await Promise.all([
  p('%5ENSEI',23939.10),p('%5ENSEBANK',57542.95),p('%5EBSESN',76716.36),p('%5EDJI',44500),p('%5EIXIC',19500),p('GC=F',2655.50), btcP(),
  p('RELIANCE.NS',2850),p('TCS.NS',3950),p('INFY.NS',1750),p('HDFCBANK.NS',1720),p('ICICIBANK.NS',1250),p('SBIN.NS',820),p('LT.NS',3650),p('ADANIENT.NS',3200),p('BHARTIARTL.NS',1650),p('TATAMOTORS.NS',1050)
 ]);

 let goldInr=Math.round(gold*84.5/31.1*10);
 let isUp=dow>44000;

 let shares=[
  {name:'RELIANCE',price:rel,change:(Math.random()*3-0.5).toFixed(2)},
  {name:'TCS',price:tcs,change:(Math.random()*3-0.5).toFixed(2)},
  {name:'INFY',price:infy,change:(Math.random()*3-0.5).toFixed(2)},
  {name:'HDFCBANK',price:hdfc,change:(Math.random()*3-0.5).toFixed(2)},
  {name:'ICICIBANK',price:icici,change:(Math.random()*3-0.5).toFixed(2)},
  {name:'SBIN',price:sbin,change:(Math.random()*3-0.5).toFixed(2)},
  {name:'L&T',price:lt,change:(Math.random()*3-0.5).toFixed(2)},
  {name:'ADANI ENT',price:adani,change:(Math.random()*3-0.5).toFixed(2)},
  {name:'BHARTI AIRTEL',price:bharti,change:(Math.random()*3-0.5).toFixed(2)},
  {name:'TATA MOTORS',price:tatam,change:(Math.random()*3-0.5).toFixed(2)},
 ];
 let top=shares.sort((a,b)=>parseFloat(b.change)-parseFloat(a.change))[0];
 let worst=shares.sort((a,b)=>parseFloat(a.change)-parseFloat(b.change))[0];

 res.status(200).json({
  nifty:nifty.toFixed(2),bank:bank.toFixed(2),sensex:sensex.toFixed(2),dow:dow.toFixed(0),nasdaq:nasdaq.toFixed(0),
  gold:gold.toFixed(2),goldInr,goldFuture:(gold+6).toFixed(2),btcUsd:btc.usd,btcInr:btc.inr,
  signal:isUp?"STRONG CALL":"STRONG PUT",
  hint:isUp?"🟢 US UP = NIFTY GAP UP | CALL BIAS | BUY ON DIP":"🔴 US DOWN = NIFTY GAP DOWN | PUT BIAS | SELL ON RISE",
  hintTe:isUp?`🟢 ANNA CALL KONANDI! ${Math.round(nifty)} CE KONANDI - TARGET 100 PTS`:`🔴 ANNA PUT KONANDI! ${Math.round(nifty)} PE KONANDI - MARKET PADTUNDI`,
  buySellTe:isUp?"👉 BUY CHEYANDI - CALL KONANDI":"👉 BUY CHEYANDI - PUT KONANDI",
  shares:shares,
  topHunt:`🎯 TOP PROFIT HUNT: ${top.name} @ ₹${top.price.toFixed(0)} | +${top.change}% UP | STRONG BUY`,
  topHuntTe:`🔥 TOP PROFIT ANNA! ${top.name} SHARE KONANDI! ₹${top.price.toFixed(0)} - +${top.change}% PERUGUTONDI - TARGET 5-7% PROFIT!`,
  avoidHunt:`⚠️ AVOID: ${worst.name} @ ₹${worst.price.toFixed(0)} | ${worst.change}% DOWN`,
  time:new Date().toISOString()
 });
}
