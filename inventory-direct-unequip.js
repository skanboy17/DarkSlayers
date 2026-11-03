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
  const old=action?.textContent;
  if(action)action.textContent='REMOVING...';
  try{
    const {data:{user}}=await darkslayersSupabase.auth.getUser();
    if(!user)throw new Error('Trebuie sa fii conectat.');
    const loadout=document.querySelector('.ds-loadout.active')?.dataset.load||'pve';
    const {data,error}=await darkslayersSupabase.from('game_equipment').delete().eq('user_id',user.id).eq('loadout',loadout).eq('equipment_slot',slot).select('id');
    if(error)throw error;
    if(!data?.length)throw new Error('Itemul nu a fost gasit in echipament.');
    if(typeof window.clearInventoryItemTooltipCache==='function')window.clearInventoryItemTooltipCache();
    if(typeof window.clearEquipmentHoverCache==='function')window.clearEquipmentHoverCache();
    if(typeof window.openCharacterInventory==='function'&&window.currentCharacterGame)await window.openCharacterInventory(window.currentCharacterGame);
  }catch(err){
    console.error('Direct unequip:',err);
    if(action)action.textContent='TRY AGAIN';
    setTimeout(()=>{if(action&&action.isConnected)action.textContent=old||'UNEQUIP'},1200);
  }finally{busy=false;}
},true);
})();