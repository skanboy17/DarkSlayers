(function(){'use strict';
if(window.__dsPvpDefeatedStatusV4)return;window.__dsPvpDefeatedStatusV4=true;
let busy=false,dead=new Map(),lastSync=0;
function fmt(sec){sec=Math.max(0,Math.ceil(Number(sec)||0));let m=Math.floor(sec/60),s=sec%60;return m+':'+String(s).padStart(2,'0')}
function uidOf(btn){return String(btn?.dataset?.pvpTarget||btn?.dataset?.pvpDefeatedTarget||'')}
function paint(){
 const arena=document.querySelector('#dsGameView .ds-pvp-list');if(!arena)return;
 arena.querySelectorAll('.ds-pvp-attack').forEach(btn=>{
  const uid=uidOf(btn);if(!uid)return;
  const row=dead.get(uid),sec=row?Math.max(0,Math.ceil((row.endsAt-Date.now())/1000)):0;
  if(sec>0){
   btn.dataset.pvpDefeatedTarget=uid;delete btn.dataset.pvpTarget;btn.disabled=true;
   const cd=fmt(sec);btn.textContent='DEFEATED · '+cd;btn.title='PvP cooldown: '+cd;
   btn.closest('.ds-pvp-player')?.classList.add('locked');
  }else if(btn.dataset.pvpDefeatedTarget){
   btn.dataset.pvpTarget=uid;delete btn.dataset.pvpDefeatedTarget;btn.disabled=false;btn.textContent='ATTACK';btn.title='';
   btn.closest('.ds-pvp-player')?.classList.remove('locked');dead.delete(uid);
  }
 });
}
async function sync(force){
 if(busy||typeof darkslayersSupabase==='undefined')return false;
 if(!force&&Date.now()-lastSync<1000){paint();return true}
 busy=true;
 try{
  const {data,error}=await darkslayersSupabase.rpc('ds_pvp_defeated_status_v2');
  if(error){console.error('PvP defeated status:',error);return false}
  const now=Date.now(),next=new Map();
  (data||[]).forEach(x=>{let sec=Math.max(0,Number(x.seconds_left)||0);if(sec>0)next.set(String(x.user_id),{endsAt:now+sec*1000})});
  dead=next;lastSync=now;paint();return true;
 }finally{busy=false}
}
/* Check the server BEFORE the normal arena click handler can attack. */
document.addEventListener('click',async function(e){
 const btn=e.target.closest?.('.ds-pvp-attack[data-pvp-target]');if(!btn||btn.dataset.pvpChecked==='1')return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 const uid=uidOf(btn);btn.disabled=true;const old=btn.textContent;btn.textContent='CHECKING...';
 await sync(true);paint();
 const row=dead.get(uid),sec=row?Math.max(0,Math.ceil((row.endsAt-Date.now())/1000)):0;
 if(sec>0){paint();return}
 btn.disabled=false;btn.textContent=old==='FIGHTING...'?'ATTACK':old;
 btn.dataset.pvpChecked='1';
 try{btn.click()}finally{delete btn.dataset.pvpChecked}
},true);
/* Arena is rebuilt often, so repaint frequently instead of depending on one render event. */
setInterval(()=>{paint();if(document.querySelector('#dsGameView .ds-pvp-list')&&Date.now()-lastSync>5000)sync(true)},500);
document.addEventListener('click',e=>{if(e.target.closest?.('[data-game-tab="pvp"],.ds-pvp-back'))setTimeout(()=>sync(true),50)},true);
new MutationObserver(()=>{if(document.querySelector('#dsGameView .ds-pvp-list'))setTimeout(()=>sync(true),20)}).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(()=>sync(true),50);window.refreshPvpDefeatedStatus=()=>sync(true);
})();