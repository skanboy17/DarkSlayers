(function(){'use strict';
if(window.__dsPvpConsumables)return;window.__dsPvpConsumables=true;
const HEALS=new Set(['minor_health','health','major_health','full_restore']);
const NAMES={'Minor HP Potion':'minor_health','HP Potion':'health','Major HP Potion':'major_health','Full Restore':'full_restore'};
let busy=false;
function bind(){
 const root=document.querySelector('#dsGameView .ds-pvp-kit');if(!root)return;
 root.querySelectorAll('.ds-pvp-con').forEach(el=>{
  const name=el.querySelector('b')?.textContent?.trim(),key=NAMES[name];
  if(!key||!HEALS.has(key))return;
  el.dataset.pvpConsumable=key;el.style.cursor='pointer';el.title='Click to use in PvP';
  if(!el.querySelector('.ds-pvp-use-label')){let x=document.createElement('small');x.className='ds-pvp-use-label';x.textContent='CLICK TO USE';x.style.cssText='display:block;color:#b52b33;margin-top:4px;font-weight:700';el.appendChild(x)}
 });
}
async function use(el){
 if(busy)return;let key=el.dataset.pvpConsumable;if(!key)return;busy=true;el.style.opacity='.55';
 try{
  const {data,error}=await darkslayersSupabase.rpc('ds_pvp_use_consumable',{p_item_key:key});
  if(error){alert(error.message||'Consumable failed');return}
  const hp=document.querySelector('#dsGameView .ds-pvp-selfhp');if(hp&&data){let max=Number(data.max_hp)||100,cur=Number(data.current_hp)||0;let bar=hp.querySelector('.ds-pvp-hp i'),txt=hp.querySelector('.ds-pvp-hptxt');if(bar)bar.style.width=Math.max(0,Math.min(100,cur/max*100))+'%';if(txt)txt.textContent=cur+' / '+max+' HP'}
  const q=el.querySelector('span'),left=Number(data?.quantity_left);if(q&&Number.isFinite(left))q.textContent='x'+left;if(left<=0)el.remove();
  if(typeof window.refreshPvpHpLive==='function')window.refreshPvpHpLive();
 }finally{busy=false;if(el?.isConnected)el.style.opacity=''}
}
document.addEventListener('click',e=>{let el=e.target.closest?.('.ds-pvp-con[data-pvp-consumable]');if(!el)return;e.preventDefault();e.stopPropagation();use(el)},true);
new MutationObserver(()=>setTimeout(bind,20)).observe(document.documentElement,{childList:true,subtree:true});setInterval(bind,1500);setTimeout(bind,300);
})();