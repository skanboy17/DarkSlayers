(function(){
'use strict';
let busy=false;
document.addEventListener('click',async function(ev){
  const slot=ev.target.closest('.ds-equip-slot[data-equipped-slot]');
  if(!slot||busy)return;
  ev.preventDefault();
  ev.stopImmediatePropagation();
  const slotName=slot.getAttribute('data-equipped-slot');
  if(!slotName||typeof darkslayersSupabase==='undefined')return;
  busy=true;
  const oldText=slot.querySelector('em');
  if(oldText)oldText.textContent='REMOVING...';
  try{
    const {data:{user}}=await darkslayersSupabase.auth.getUser();
    if(!user)throw new Error('Trebuie sa fii conectat.');
    const {data,error}=await darkslayersSupabase
      .from('game_equipment')
      .delete()
      .eq('user_id',user.id)
      .eq('loadout',document.querySelector('.ds-loadout.active')?.dataset.load||'pve')
      .eq('equipment_slot',slotName)
      .select('id');
    if(error)throw error;
    if(!data||!data.length)throw new Error('Itemul nu a fost gasit in echipament.');
    if(typeof window.openCharacterInventory==='function'&&window.currentCharacterGame){
      await window.openCharacterInventory(window.currentCharacterGame);
    }
  }catch(err){
    console.error('Unequip:',err);
    if(oldText)oldText.textContent='ERROR - TRY AGAIN';
  }finally{busy=false;}
},true);
})();