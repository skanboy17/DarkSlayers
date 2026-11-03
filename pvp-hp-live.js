(function(){'use strict';
if(window.__dsPvpHpLiveV2)return;window.__dsPvpHpLiveV2=true;
let busy=false,last=0;
async function sync(force){
 const box=document.querySelector('#dsGameView .ds-pvp-selfhp');
 if(!box||busy||typeof darkslayersSupabase==='undefined')return;
 if(!force&&Date.now()-last<10000)return;
 busy=true;
 try{
  const {data,error}=await darkslayersSupabase.rpc('ds_pvp_regen_hp');
  if(error||!data){if(error)console.error('PvP HP regen:',error);return}
  last=Date.now();const max=Math.max(1,Number(data.max_hp)||100);let hp=Number(data.current_hp);if(!Number.isFinite(hp))hp=max;hp=Math.max(0,Math.min(max,hp));
  const bar=box.querySelector('.ds-pvp-hp i'),txt=box.querySelector('.ds-pvp-hptxt');if(bar)bar.style.width=(hp/max*100)+'%';if(txt)txt.textContent=hp+' / '+max+' HP';
 }finally{busy=false}
}
document.addEventListener('click',e=>{if(e.target.closest?.('[data-game-tab="pvp"],.ds-pvp-back,.ds-pvp-attack,.ds-equip-btn,.ds-unequip-btn,.ds-pvp-con'))setTimeout(()=>sync(true),120)},true);
window.refreshPvpHp=()=>sync(true);window.refreshPvpHpLive=()=>sync(true);
setInterval(()=>{if(document.querySelector('#dsGameView .ds-pvp-selfhp'))sync(false)},15000);
})();