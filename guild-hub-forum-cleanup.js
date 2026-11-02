/* DARKSLAYERS - move old Guild Hub rules into Forum */
(function(){
'use strict';
function apply(){
 const hub=document.getElementById('hub');
 if(hub) hub.style.display='none';
 document.querySelectorAll('a[href="#hub"]').forEach(a=>a.style.display='none');
 const filter=document.getElementById('forumCategoryFilter');
 if(filter && ![...filter.options].some(o=>o.value==='Reguli')){
  const o=document.createElement('option');o.value='Reguli';o.textContent='Reguli & Informatii';filter.insertBefore(o,filter.options[1]||null);
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();