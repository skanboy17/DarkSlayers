(function(){
'use strict';
let busy=false;
document.addEventListener('click',async function(ev){
  const card=ev.target.closest('.ds-item[data-inventory-unequip]');
  if(!card||busy)return;
  ev.preventDefault();
  ev.stopImmediatePropagation();
  const slot=card.dataset.inventoryUnequip;
  if(!slot||typeof darkslayersSupabase==='undefined')return;
  busy=true;
  const action=card.querySelector('.ds-item-mini-action');
  const loadout=document.querySelector('.ds-loadout.active')?.dataset.load||'pve';
  const equippedSlot=document.querySelector('.ds-equip-slot[data-equipped-hover="'+CSS.escape(slot)+'"],.ds-equip-slot[data-equipped-slot="'+CSS.escape(slot)+'"]');
  const oldSlotHtml=equippedSlot?.innerHTML||'';
  const oldSlotClass=equippedSlot?.className||'';
  // Optimistic UI: show the result immediately, while the DB delete happens in background.
  card.classList.remove('is-equipped');
  card.removeAttribute('data-inventory-unequip');
  card.setAttribute('data-item',card.getAttribute('data-item')||'');
  if(action){action.textContent='EQUIP';action.style.pointerEvents='none';}
  if(equippedSlot){
    equippedSlot.classList.remove('has-item');
    equippedSlot.removeAttribute('data-equipped-hover');
    equippedSlot.removeAttribute('data-equipped-slot');
    const label=(slot==='main_hand'?'MAIN HAND':slot==='off_hand'?'OFF HAND':slot.toUpperCase());
    equippedSlot.innerHTML=label+'<b>EMPTY</b>';
  }
  try{
    const {data:{user}}=await darkslayersSupabase.auth.getUser();
    if(!user)throw new Error('Trebuie sa fii conectat.');
    const {data,error}=await darkslayersSupabase.from('game_equipment').delete().eq('user_id',user.id).eq('loadout',loadout).eq('equipment_slot',slot).select('id');
    if(error)throw error;
    if(!data?.length)throw new Error('Itemul nu a fost gasit in echipament.');
    if(typeof window.clearInventoryItemTooltipCache==='function')window.clearInventoryItemTooltipCache();
    if(typeof window.clearEquipmentHoverCache==='function')window.clearEquipmentHoverCache();
    // Refresh silently after the delete is confirmed; no REMOVING state.
    if(typeof window.openCharacterInventory==='function'&&window.currentCharacterGame)await window.openCharacterInventory(window.currentCharacterGame);
  }catch(err){
    console.error('Direct unequip:',err);
    // Restore the real server state if the delete failed.
    if(equippedSlot){equippedSlot.className=oldSlotClass;equippedSlot.innerHTML=oldSlotHtml;equippedSlot.setAttribute('data-equipped-hover',slot);}
    if(typeof window.openCharacterInventory==='function'&&window.currentCharacterGame)await window.openCharacterInventory(window.currentCharacterGame);
  }finally{busy=false;}
},true);
})();