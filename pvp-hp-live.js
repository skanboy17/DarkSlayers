(function(){'use strict';
if(window.__dsPvpHpLive)return;window.__dsPvpHpLive=true;
let busy=false,timer=null,regenTimer=null;
async function sync(){
 if(busy||typeof darkslayersSupabase==='undefined')return;
 const box=document.querySelector('#dsGameView .ds-pvp-selfhp');if(!box)return;
 busy=true;
 try{
  const {data,error}=await darkslayersSupabase.rpc('ds_pvp_regen_hp');
  if(error||!data){if(error)console.error('PvP HP regen:',error);return}
  const max=Math.max(1,Number(data.max_hp)||100);
  let hp=Number(data.current_hp);if(!Number.isFinite(hp))hp=max;hp=Math.max(0,Math.min(max,hp));
  const bar=box.querySelector('.ds-pvp-hp i'),txt=box.querySelector('.ds-pvp-hptxt');
  if(bar)bar.style.width=(hp/max*100)+'%';
  if(txt)txt.textContent=hp+' / '+max+' HP';
 }finally{busy=false}
}
function schedule(){clearTimeout(timer);timer=setTimeout(sync,40)}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',function(e){if(e.target.closest?.('[data-game-tab="pvp"],.ds-pvp-back,.ds-pvp-attack,.ds-equip-btn,.ds-unequip-btn'))setTimeout(sync,180)},true);
window.refreshPvpHp=sync;
setTimeout(sync,250);
regenTimer=setInterval(sync,15000);
})();