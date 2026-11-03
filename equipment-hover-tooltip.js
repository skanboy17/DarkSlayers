(function(){
'use strict';
let tip=null, last=null;
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function ensure(){
 if(tip)return tip;
 tip=document.createElement('div');
 tip.id='dsEquippedHoverTooltip';
 tip.style.cssText='position:fixed;z-index:2147483647;display:none;pointer-events:none;width:230px;background:#080808;border:1px solid #8d272d;padding:12px;box-shadow:0 10px 30px rgba(0,0,0,.9);color:#aaa;font:11px Arial,sans-serif;';
 document.body.appendChild(tip);return tip;
}
function move(x,y){let t=ensure(),left=x+16,top=y+16;if(left+260>window.innerWidth)left=x-250;if(top+250>window.innerHeight)top=y-235;t.style.left=Math.max(8,left)+'px';t.style.top=Math.max(8,top)+'px';}
async function show(el,x,y){
 let slot=el.dataset.equippedHover;if(!slot||typeof darkslayersSupabase==='undefined')return;
 let t=ensure();t.innerHTML='<b style="color:#ddd">Loading...</b>';t.style.display='block';move(x,y);
 try{
  const {data:{user}}=await darkslayersSupabase.auth.getUser();if(!user)return hide();
  let loadout=document.querySelector('.ds-loadout.active')?.dataset.load||'pve';
  const {data:eqRow}=await darkslayersSupabase.from('game_equipment').select('inventory_item_id').eq('user_id',user.id).eq('loadout',loadout).eq('equipment_slot',slot).maybeSingle();
  if(!eqRow?.inventory_item_id)return hide();
  const {data:item}=await darkslayersSupabase.from('game_inventory').select('durability,game_item_defs(*)').eq('user_id',user.id).eq('id',eqRow.inventory_item_id).maybeSingle();
  let d=item?.game_item_defs;if(!d)return hide();
  let rows=[['Power',d.power||0,''],['Armor',d.armor||0,''],['HP',d.health||0,''],['Crit',d.crit||0,'%'],['Dodge',d.dodge||0,'%']].filter(r=>Number(r[1])!==0);
  t.innerHTML='<div style="color:#fff;font:700 15px Georgia;margin-bottom:4px">'+esc(d.item_name)+'</div><div style="color:#d6a536;font:700 9px Arial;margin-bottom:8px">'+esc(String(d.rarity||'').toUpperCase())+' · '+esc(String(d.item_type||'').replace('_',' ').toUpperCase())+'</div>'+rows.map(r=>'<div style="display:flex;justify-content:space-between;border-top:1px solid #211719;padding:5px 0"><span>'+r[0]+'</span><b style="color:#eee">+'+r[1]+r[2]+'</b></div>').join('')+'<div style="display:flex;justify-content:space-between;border-top:1px solid #211719;padding:5px 0"><span>Durability</span><b style="color:#eee">'+(item.durability??100)+'/100</b></div>';
 }catch(e){hide();}
}
function hide(){if(tip)tip.style.display='none';last=null;}
document.addEventListener('mouseover',function(ev){let el=ev.target.closest?.('.ds-equip-slot[data-equipped-hover]');if(!el||el===last)return;last=el;show(el,ev.clientX,ev.clientY);},true);
document.addEventListener('mousemove',function(ev){if(last&&tip&&tip.style.display!=='none')move(ev.clientX,ev.clientY);},true);
document.addEventListener('mouseout',function(ev){let el=ev.target.closest?.('.ds-equip-slot[data-equipped-hover]');if(el&&!el.contains(ev.relatedTarget))hide();},true);
})();