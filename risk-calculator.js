"use strict";
const $=id=>document.getElementById(id);
const yen=n=>Math.round(n).toLocaleString("ja-JP")+"円";
function calculate(){
 const balance=Number($("balance").value),risk=Number($("risk").value),stop=Number($("stop").value),extra=Number($("spread").value),rate=Number($("usdjpy").value),step=Number($("lotstep").value);
 const usd=$("pair").value==="usd";
 const err=$("error");err.textContent="";
 if(![balance,risk,stop,extra,rate,step].every(Number.isFinite)||balance<=0||risk<=0||risk>100||stop<=0||extra<0||rate<=0||step<=0){err.textContent="正しい正の数値を入力してね（追加幅は0以上、リスクは100％以下）。";["loss","lots","estimated"].forEach(id=>$(id).textContent="—");$("units").textContent="";$("note").textContent="";return;}
 const maxLoss=balance*risk/100;
 const pipYen=usd?0.0001*rate:0.01;
 const rawUnits=maxLoss/((stop+extra)*pipYen);
 const rawLots=rawUnits/100000;
 const decimals=(String(step).split(".")[1]||"").length;
 const lots=Math.floor((rawLots+1e-12)/step)*step;
 const safeLots=Number(lots.toFixed(decimals));
 const units=Math.round(safeLots*100000);
 const estimated=units*(stop+extra)*pipYen;
 $("loss").textContent=yen(maxLoss);
 $("lots").textContent=safeLots.toFixed(decimals)+" lot";
 $("estimated").textContent=yen(estimated);
 $("units").textContent="取引数量の目安："+units.toLocaleString("ja-JP")+"通貨（1ロット＝100,000通貨を仮定）";
 $("note").textContent=safeLots===0?"⚠️ この条件では最小ロットでも許容損失を超えるため、取引見送りが目安だよ。":"⚠️ 概算の上限だよ。スプレッド・滑り・手数料・レート変動によって実損失は増える場合があるよ。";
}
$("calculate").addEventListener("click",calculate);
["balance","risk","stop","spread","usdjpy","pair","lotstep"].forEach(id=>$(id).addEventListener("change",calculate));
calculate();