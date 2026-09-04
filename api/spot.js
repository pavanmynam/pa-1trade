export default async function handler(req, res){
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Cache-Control','no-store');
 async function y(s){try{let r=await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1m`,{headers:{'User-Agent':'Mozilla/5.0'}});let j=await r.json();return j.chart.result[0].meta.regularMarketPrice}catch(e){return null}}
 let [nifty,bank,sensex,dow,nasdaq,goldF] = await Promise.all([y('%5ENSEI'),y('%5ENSEBANK'),y('%5EBSESN'),y('%5EDJI'),y('%5EIXIC'),y('GC=F')]);
 let btc=82000,btcInr=6900000; try{let r=await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,inr');let j=await r.json();btc=j.bitcoin.usd;btcInr=j.bitcoin.inr}catch(e){}
 let gold = (goldF && goldF>2000 && goldF<3500) ? goldF : 2655.50;
 let goldInr = Math.round(gold*84.5/31.1*10);
 let hint = (dow||43000)>43000 ? "🟢 US UP = NIFTY GAP UP | CALL BIAS | BUY ON DIP" : "🔴 US DOWN = NIFTY GAP DOWN | PUT BIAS | SELL ON RISE";
 let signal = (nifty||23950)>23950 ? "STRONG CALL" : "STRONG PUT";
 res.status(200).json({nifty:(nifty||23951).toFixed(2),bank:(bank||57557).toFixed(2),sensex:(sensex||76815).toFixed(2),dow:(dow||43200).toFixed(0),nasdaq:(nasdaq||19500).toFixed(0),gold:gold.toFixed(2),goldInr,goldFuture:(gold+6).toFixed(2),btcUsd:btc,btcInr,signal,hint,time:new Date().toISOString()});
}
