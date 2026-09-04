export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Cache-Control','no-store');
 try{
  const p = async (s,f) => { try{ let r=await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1m`,{headers:{'User-Agent':'Mozilla/5.0'}}); let j=await r.json(); return j.chart.result[0].meta.regularMarketPrice||f }catch{return f} }
  const btcP = async () => { try{ let r=await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,inr'); let j=await r.json(); return j.bitcoin }catch{return{usd:80863,inr:7640000}} }
  let [nifty,bank,sensex,dow,gold,btc] = await Promise.all([p('%5ENSEI',23940.85),p('%5ENSEBANK',57589.05),p('%5EBSESN',76716.29),p('%5EDJI',44500),p('GC=F',2655.5),btcP()]);
  let goldInr=Math.round(gold*84.5/31.1*10); let isUp=true;
  let shares=[{name:'RELIANCE',price:2850,change:'+2.85'},{name:'TCS',price:3950,change:'+1.20'},{name:'INFY',price:1750,change:'-0.50'},{name:'HDFCBANK',price:1720,change:'+1.80'},{name:'SBIN',price:820,change:'+2.10'}].map(s=>({...s,action:parseFloat(s.change)>0?'BUY':'SELL'}));
  let top=shares[0];
  res.json({
   nifty:nifty.toFixed(2),bank:bank.toFixed(2),sensex:sensex.toFixed(2),gold:gold.toFixed(2),goldInr,btcUsd:btc.usd,btcInr:btc.inr,
   niftyAction:'BUY',sensexAction:'BUY',bankAction:'BUY',goldAction:'BUY',btcAction:'BUY',
   niftyActionTe:`NIFTY ${Math.round(nifty)} CE KONANDI ANNA!`,
   sensexActionTe:`SENSEX ${Math.round(sensex)} CE KONANDI!`,
   hint:'US UP = NIFTY GAP UP | CALL BIAS | BUY ON DIP',
   shares,topHunt:`TOP PROFIT: ${top.name} @ ₹${top.price} | ${top.change}%`,topHuntTe:`TOP PROFIT ANNA! ${top.name} KONANDI! TARGET 5-7%`,
   hotTopics:`🔥 HOT TOPICS TELUGU: NIFTY ${nifty.toFixed(0)} PERUGUTONDI - BULL MARKET NADUSTONDI! BANK NIFTY ${bank.toFixed(0)} STRONG GA UNDI! GOLD ₹${goldInr} - 1.2 LAKH DAATI PERIGINDI! BTC ₹${(btc.inr/100000).toFixed(1)} LAKSHALU! TOP HOT: ${top.name} BREAKOUT +${top.change}%!`,
   marketSummary:`📈 MARKET ELA UNDI? MARKET BULLISH GA UNDI ANNA! EDI KONALI? NIFTY ${Math.round(nifty/50)*50} CE KONANDI! SENSEX CALL KONANDI! EDI PERUGUTONDI? GOLD PERUGUTONDI - ₹${goldInr}! BTC PERUGUTONDI! ${top.name} PERUGUTONDI! EDI VADDA? PUT LU VADDU - CALLS LO PROFIT VASTUNDI!`
  });
 }catch(e){
  res.json({nifty:'23940.85',bank:'57589.05',sensex:'76716.29',gold:'2655.50',goldInr:123264,btcUsd:80863,btcInr:7620000,niftyAction:'BUY',sensexAction:'BUY',bankAction:'BUY',goldAction:'BUY',btcAction:'BUY',niftyActionTe:'NIFTY 23941 CE KONANDI ANNA!',sensexActionTe:'SENSEX 76716 CE KONANDI!',hint:'US UP = NIFTY GAP UP | CALL BIAS',shares:[{name:'RELIANCE',price:2850,change:'+2.85',action:'BUY'}],topHunt:'TOP PROFIT: RELIANCE @ ₹2850',topHuntTe:'RELIANCE KONANDI!',hotTopics:'🔥 HOT TOPICS: NIFTY PERUGUTONDI - BULL! GOLD 1.2L PERIGINDI! BTC 76L!',marketSummary:'📈 MARKET BULLISH! NIFTY CE KONANDI! GOLD PERUGUTONDI! PUT LU VADDU!'});
 }
}
