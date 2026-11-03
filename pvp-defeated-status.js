(function(){'use strict';
if(window.__dsPvpDefeatedStatus)return;window.__dsPvpDefeatedStatus=true;
let busy=false,timer=null,dead=new Map();
function fmt(sec){sec=Math.max(0,Math.ceil(Number(sec)||0));let m=Math.floor(sec/60),s=sec%60;return m+':'+String(s).padStart(2,'0')}
function paint(){
 const arena=document.querySelector('#dsGameView .ds-pvp-list');if(!arena)return;
 arena.querySelectorAll('.ds-pvp-attack').forEach(btn=>{
  const uid=String(btn.dataset.pvpTarget||btn.dataset.pvpDefeatedTarget||'');if(!uid)return;
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
async function sync(){
 if(busy||typeof darkslayersSupabase==='undefined')return;const arena=document.querySelector('#dsGameView .ds-pvp-list');if(!arena)return;
 busy=true;try{
  const {data,error}=await darkslayersSupabase.rpc('ds_pvp_defeated_status_v2');
  if(error){console.error('PvP defeated status:',error);return}
  const now=Date.now(),next=new Map();(data||[]).forEach(x=>{let sec=Math.max(0,Number(x.seconds_left)||0);if(sec>0)next.set(String(x.user_id),{endsAt:now+sec*1000})});dead=next;paint();
 }finally{busy=false}
}
function schedule(){clearTimeout(timer);timer=setTimeout(sync,100)}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',e=>{if(e.target.closest?.('[data-game-tab="pvp"],.ds-pvp-back,.ds-pvp-attack'))setTimeout(sync,150)},true);
setInterval(paint,1000);setInterval(sync,10000);setTimeout(sync,250);window.refreshPvpDefeatedStatus=sync;
})();