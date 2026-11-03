(function(){
'use strict';
const KEY='darkslayers-rpg-active-tab';
let restoring=false,lastSaved=sessionStorage.getItem(KEY)||'character';
function normalize(tab){return tab==='equipment'?'inventory':tab}
function save(tab){tab=normalize(tab);if(['character','inventory','dungeon','pvp'].includes(tab)){lastSaved=tab;sessionStorage.setItem(KEY,tab)}}
function wanted(){return lastSaved||sessionStorage.getItem(KEY)||'character'}
function topButton(tab){return document.querySelector('.ds-char-tab[data-game-tab="'+tab+'"]')}
function current(){let b=document.querySelector('.ds-char-tab.active');return b?b.dataset.gameTab:null}
async function restore(){if(restoring)return;const tab=wanted();if(tab==='character'){if(current()!=='character'){const b=topButton('character');if(b)b.click()}return}if(current()===tab)return;const b=topButton(tab);if(!b)return;restoring=true;try{b.click()}finally{setTimeout(()=>{restoring=false},200)}}
document.addEventListener('click',e=>{if(restoring||!e.isTrusted)return;const b=e.target.closest('[data-game-tab]');if(!b)return;save(b.dataset.gameTab)},true);
// Only restore when the Character panel is actually rebuilt. Do not rerender on browser focus/visibility changes.
const mo=new MutationObserver(mutations=>{const panel=document.querySelector('main.dashboard section.panel.news');if(!panel)return;const tab=wanted();if(tab==='character'||current()===tab)return;const rebuilt=mutations.some(m=>m.type==='childList'&&m.target===panel);if(rebuilt)setTimeout(restore,0)});
function start(){const panel=document.querySelector('main.dashboard section.panel.news');if(panel)mo.observe(panel,{childList:true});restore()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,0));else setTimeout(start,0);
window.darkslayersRestoreRpgTab=restore;
})();