(function(){
'use strict';
const KEY='darkslayers-rpg-active-tab';
let restoring=false;
function wanted(){return sessionStorage.getItem(KEY)||'character'}
function save(tab){if(['character','inventory','dungeon','pvp'].includes(tab))sessionStorage.setItem(KEY,tab)}
function topButton(tab){return document.querySelector('.ds-char-tab[data-game-tab="'+tab+'"]')}
function current(){let b=document.querySelector('.ds-char-tab.active');return b?b.dataset.gameTab:null}
function restore(){if(restoring)return;let tab=wanted();if(tab==='character'||current()===tab)return;let b=topButton(tab);if(!b)return;restoring=true;b.click();setTimeout(()=>{restoring=false},120)}
document.addEventListener('click',e=>{let b=e.target.closest('[data-game-tab]');if(!b)return;let tab=b.dataset.gameTab;if(tab==='equipment')tab='inventory';save(tab)},true);
const mo=new MutationObserver(()=>{let tab=wanted();if(tab!=='character'&&current()!==tab)setTimeout(restore,0)});
function start(){let panel=document.querySelector('main.dashboard section.panel.news');if(panel)mo.observe(panel,{childList:true,subtree:true});restore()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,0));else setTimeout(start,0);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(restore,30)});
window.addEventListener('focus',()=>setTimeout(restore,30));
})();