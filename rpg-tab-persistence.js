(function(){
'use strict';
const KEY='darkslayers-rpg-active-tab';
let active='character';
// A fresh page load must always start on CHARACTER. We only remember the tab while this page stays open.
sessionStorage.removeItem(KEY);
function normalize(tab){return tab==='equipment'?'inventory':tab}
function save(tab){tab=normalize(tab);if(['character','inventory','dungeon','pvp'].includes(tab)){active=tab;sessionStorage.setItem(KEY,tab)}}
function topButton(tab){return document.querySelector('.ds-char-tab[data-game-tab="'+tab+'"]')}
function current(){const b=document.querySelector('.ds-char-tab.active');return b?b.dataset.gameTab:null}
function restoreAfterRebuild(){if(active==='character'||current()===active)return;const b=topButton(active);if(b)b.click()}
// Save only the user's actual RPG navigation.
document.addEventListener('click',e=>{if(!e.isTrusted)return;const b=e.target.closest('[data-game-tab]');if(!b)return;save(b.dataset.gameTab)},true);
// refreshCharacterGame can rebuild the panel while the page remains open. Restore only after that real rebuild.
const mo=new MutationObserver(mutations=>{const panel=document.querySelector('main.dashboard section.panel.news');if(!panel||active==='character'||current()===active)return;const rebuilt=mutations.some(m=>m.type==='childList'&&m.target===panel);if(rebuilt)setTimeout(restoreAfterRebuild,0)});
function start(){const panel=document.querySelector('main.dashboard section.panel.news');if(panel)mo.observe(panel,{childList:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,0));else setTimeout(start,0);
window.darkslayersRestoreRpgTab=restoreAfterRebuild;
})();