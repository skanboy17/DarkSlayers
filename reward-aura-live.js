/* DARKSLAYERS - lightweight live reward aura animation */
(function(){
'use strict';
const running=new WeakSet();
function start(el){
 if(!el||running.has(el))return;
 running.add(el);
 const aura=el.querySelector('.ds-roster-aura');
 if(aura&&aura.animate){aura.animate([{transform:'scale(.92)',opacity:.55},{transform:'scale(1.13)',opacity:1},{transform:'scale(.92)',opacity:.55}],{duration:1550,iterations:Infinity,easing:'ease-in-out'});}
}
function scan(root){(root||document).querySelectorAll('.ds-roster-rw-effect').forEach(start)}
function watchRoster(){var list=document.querySelector('.roster-list');if(!list||list.dataset.auraWatch==='1')return;list.dataset.auraWatch='1';new MutationObserver(function(){scan(list)}).observe(list,{childList:true});scan(list)}
function boot(){watchRoster();scan(document);var root=document.querySelector('.panel.member');if(root)new MutationObserver(function(){watchRoster()}).observe(root,{childList:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.refreshRewardAuraLive=function(){watchRoster();scan(document)};
})();