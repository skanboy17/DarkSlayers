(function(){'use strict';
if(window.__dsPvpHpLiveV3)return;window.__dsPvpHpLiveV3=true;
let busy=false,last=0,timerUntil=0,ticker=0;
function fmt(sec){sec=Math.max(0,Math.ceil(sec));let m=Math.floor(sec/60),s=sec%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
function ensureStatus(box){let el=box.querySelector('.ds-pvp-my-defeated');if(!el){el=document.createElement('div');el.className='ds-pvp-my-defeated';el.style.cssText='display:none;margin-top:9px;border:1px solid #762129;background:#17090b;padding:9px 11px;color:#e14a52;font:700 10px Arial;letter-spacing:.7px;text-align:center';box.appendChild(el)}return el}
function paintTimer(){const box=document.querySelector('#dsGameView .ds-pvp-selfhp');if(!box)return;const el=ensureStatus(box),left=Math.max(0,Math.ceil((timerUntil-Date.now())/1000));if(left>0){el.style.display='block';el.textContent='DEFEATED · '+fmt(left)+' RAMASE';}else{el.style.display='none';el.textContent='';}}
async function sync(force){
 const box=document.querySelector('#dsGameView .ds-pvp-selfhp');
 if(!box||busy||typeof darkslayersSupabase==='undefined')return;
 if(!force&&Date.now()-last<10000){paintTimer();return}
 busy=true;
 try{
  const [{data:hpData,error:hpErr},{data:stData,error:stErr}]=await Promise.all([darkslayersSupabase.rpc('ds_pvp_regen_hp'),darkslayersSupabase.rpc('ds_pvp_my_status')]);
  if(hpErr)console.error('PvP HP regen:',hpErr);if(stErr)console.error('PvP personal status:',stErr);
  const row=Array.isArray(stData)?stData[0]:stData;
  const data=row||hpData;if(!data)return;
  last=Date.now();const max=Math.max(1,Number(data.max_hp)||100);let hp=Number(data.current_hp);if(!Number.isFinite(hp))hp=max;hp=Math.max(0,Math.min(max,hp));
  const bar=box.querySelector('.ds-pvp-hp i'),txt=box.querySelector('.ds-pvp-hptxt');if(bar)bar.style.width=(hp/max*100)+'%';if(txt)txt.textContent=hp+' / '+max+' HP';
  let sec=Math.max(0,Number(row?.seconds_left)||0);timerUntil=row?.defeated&&sec>0?Date.now()+sec*1000:0;paintTimer();
 }finally{busy=false}
}
document.addEventListener('click',e=>{if(e.target.closest?.('[data-game-tab="pvp"],.ds-pvp-back,.ds-pvp-attack,.ds-equip-btn,.ds-unequip-btn,.ds-pvp-con'))setTimeout(()=>sync(true),120)},true);
document.addEventListener('ds:pvp-battle-finished',()=>setTimeout(()=>sync(true),100));
window.refreshPvpHp=()=>sync(true);window.refreshPvpHpLive=()=>sync(true);
setInterval(()=>{if(document.querySelector('#dsGameView .ds-pvp-selfhp'))sync(false)},15000);ticker=setInterval(paintTimer,1000);
})();