(function(){'use strict';
if(window.__dsPvpHpLive)return;window.__dsPvpHpLive=true;
let busy=false,timer=null;
async function sync(){
 if(busy||typeof darkslayersSupabase==='undefined')return;
 const box=document.querySelector('#dsGameView .ds-pvp-selfhp');if(!box)return;
 busy=true;
 try{
  const {data:{user}}=await darkslayersSupabase.auth.getUser();if(!user)return;
  const {data,error}=await darkslayersSupabase.from('game_characters').select('health,current_hp').eq('user_id',user.id).maybeSingle();
  if(error||!data)return;
  const max=Math.max(1,Number(data.health)||100);
  let hp=Number(data.current_hp);if(!Number.isFinite(hp))hp=max;hp=Math.max(0,Math.min(max,hp));
  const bar=box.querySelector('.ds-pvp-hp i'),txt=box.querySelector('.ds-pvp-hptxt');
  if(bar)bar.style.width=(hp/max*100)+'%';
  if(txt)txt.textContent=hp+' / '+max+' HP';
 }finally{busy=false}
}
function schedule(){clearTimeout(timer);timer=setTimeout(sync,40)}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',function(e){if(e.target.closest?.('[data-game-tab="pvp"],.ds-pvp-back,.ds-pvp-attack'))setTimeout(sync,150)},true);
window.refreshPvpHp=sync;
})();