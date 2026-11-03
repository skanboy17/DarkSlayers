(function(){'use strict';
if(window.__dsPvpDefeatedStatus)return;window.__dsPvpDefeatedStatus=true;
let busy=false,timer=null,dead=new Map();
function left(until){let ms=new Date(until).getTime()-Date.now();if(!Number.isFinite(ms)||ms<=0)return '';let s=Math.max(0,Math.ceil(ms/1000)),m=Math.floor(s/60);s%=60;return m+':'+String(s).padStart(2,'0')}
function paint(){
 const arena=document.querySelector('#dsGameView .ds-pvp-list');if(!arena)return;
 arena.querySelectorAll('.ds-pvp-attack').forEach(btn=>{
  const uid=String(btn.dataset.pvpTarget||btn.dataset.pvpDefeatedTarget||'');if(!uid)return;
  const until=dead.get(uid),cd=until?left(until):'';
  if(cd){
   btn.dataset.pvpDefeatedTarget=uid;delete btn.dataset.pvpTarget;btn.disabled=true;
   btn.textContent='DEFEATED · '+cd;btn.title='PvP cooldown: '+cd;
   btn.closest('.ds-pvp-player')?.classList.add('locked');
  }else if(btn.dataset.pvpDefeatedTarget){
   btn.dataset.pvpTarget=uid;delete btn.dataset.pvpDefeatedTarget;btn.disabled=false;btn.textContent='ATTACK';btn.title='';
   btn.closest('.ds-pvp-player')?.classList.remove('locked');dead.delete(uid);
  }
 });
}
async function sync(){
 if(busy||typeof darkslayersSupabase==='undefined')return;const arena=document.querySelector('#dsGameView .ds-pvp-list');if(!arena)return;
 busy=true;try{const {data,error}=await darkslayersSupabase.rpc('ds_pvp_defeated_status');if(error){console.error('PvP defeated status:',error);return}dead=new Map((data||[]).map(x=>[String(x.user_id),x.defeated_until]));paint()}finally{busy=false}
}
function schedule(){clearTimeout(timer);timer=setTimeout(sync,80)}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',e=>{if(e.target.closest?.('[data-game-tab="pvp"],.ds-pvp-back,.ds-pvp-attack'))setTimeout(sync,200)},true);
setInterval(paint,1000);setInterval(sync,15000);setTimeout(sync,300);window.refreshPvpDefeatedStatus=sync;
})();