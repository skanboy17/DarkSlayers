(function(){
'use strict';
const KEY='darkslayers-rpg-active-tab';
let active='character';
let restoring=false;
// A fresh page load must always start on CHARACTER. We only remember the tab while this page stays open.
sessionStorage.removeItem(KEY);
function normalize(tab){return tab==='equipment'?'inventory':tab}
function save(tab){tab=normalize(tab);if(['character','inventory','dungeon','pvp'].includes(tab)){active=tab;sessionStorage.setItem(KEY,tab)}}
function topButton(tab){return document.querySelector('.ds-char-tab[data-game-tab="'+tab+'"]')}
function current(){const b=document.querySelector('.ds-char-tab.active');return b?b.dataset.gameTab:null}
async function restoreAfterRebuild(){
 if(restoring||active==='character'||current()===active)return;
 restoring=true;
 try{
  const c=window.currentCharacterGame;
  if(active==='inventory'&&c&&typeof window.openCharacterInventory==='function'){
   document.querySelectorAll('.ds-char-tab').forEach(x=>x.classList.toggle('active',x.dataset.gameTab==='inventory'));
   await window.openCharacterInventory(c);
  }else if(active==='dungeon'&&c&&typeof window.openCharacterDungeon==='function'){
   document.querySelectorAll('.ds-char-tab').forEach(x=>x.classList.toggle('active',x.dataset.gameTab==='dungeon'));
   await window.openCharacterDungeon(c);
  }else{
   const b=topButton(active);if(b)b.click();
  }
 }finally{restoring=false}
}
// Save only the user's actual RPG navigation.
document.addEventListener('click',e=>{if(!e.isTrusted)return;const b=e.target.closest('[data-game-tab]');if(!b)return;save(b.dataset.gameTab)},true);
// Only restore after the whole character panel itself was rebuilt. Changes inside #dsGameView
// are normal Inventory/Dungeon rendering and must NOT trigger a second tab navigation.
const mo=new MutationObserver(mutations=>{
 const panel=document.querySelector('main.dashboard section.panel.news');
 if(!panel||restoring||active==='character'||current()===active)return;
 const rebuilt=mutations.some(m=>m.type==='childList'&&m.target===panel);
 if(rebuilt)setTimeout(restoreAfterRebuild,0);
});
function start(){const panel=document.querySelector('main.dashboard section.panel.news');if(panel)mo.observe(panel,{childList:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,0));else setTimeout(start,0);
window.darkslayersRestoreRpgTab=restoreAfterRebuild;
})();