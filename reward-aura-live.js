/* DARKSLAYERS - force visible live reward aura animation */
(function(){
'use strict';
const running=new WeakSet();
function start(el){
 if(!el||running.has(el))return;
 running.add(el);
 const aura=el.querySelector('.ds-roster-aura');
 if(aura&&aura.animate){
  aura.animate([
   {transform:'scale(.88)',opacity:.45,filter:'brightness(.9)',boxShadow:'0 0 5px #fff,0 0 10px var(--fx,#ffe000),0 0 18px var(--fx,#ffe000)'},
   {transform:'scale(1.18)',opacity:1,filter:'brightness(1.7)',boxShadow:'0 0 14px #fff,0 0 30px var(--fx,#ffe000),0 0 55px var(--fx,#ffe000),0 0 78px var(--fx,#ffe000)'},
   {transform:'scale(.88)',opacity:.45,filter:'brightness(.9)',boxShadow:'0 0 5px #fff,0 0 10px var(--fx,#ffe000),0 0 18px var(--fx,#ffe000)'}
  ],{duration:1350,iterations:Infinity,easing:'ease-in-out'});
 }
 if(el.animate){
  el.animate([
   {filter:'brightness(.92)',boxShadow:'0 0 7px var(--fx,#ffe000),0 0 14px var(--fx,#ffe000)'},
   {filter:'brightness(1.45)',boxShadow:'0 0 14px #fff,0 0 32px var(--fx,#ffe000),0 0 58px var(--fx,#ffe000)'},
   {filter:'brightness(.92)',boxShadow:'0 0 7px var(--fx,#ffe000),0 0 14px var(--fx,#ffe000)'}
  ],{duration:1350,iterations:Infinity,easing:'ease-in-out'});
 }
}
function scan(){document.querySelectorAll('.ds-roster-rw-effect').forEach(start);}
function boot(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});setInterval(scan,1000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.refreshRewardAuraLive=scan;
})();