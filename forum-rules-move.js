/* DARKSLAYERS - move Rules from old Guild Hub into Forum */
(function(){
'use strict';
const RULE_ICON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h10l3 3v15H6V3Z"/><path d="M16 3v4h4M9 10h7M9 14h7M9 18h5"/></svg>';
function hideOldHub(){
 const hub=document.getElementById('hub');
 if(hub) hub.style.display='none';
 document.querySelectorAll('a[href="#hub"]').forEach(a=>a.style.display='none');
}
function addRules(){
 hideOldHub();
 const home=document.querySelector('#forumTopics .ds-forum-home');
 if(!home)return;
 const group=home.querySelector('.ds-forum-group');
 if(!group||group.querySelector('.ds-forum-rules'))return;
 const title=group.querySelector('.ds-forum-group-title');
 const row=document.createElement('button');
 row.type='button';
 row.className='ds-forum-cat ds-forum-rules';
 row.innerHTML='<span class="ds-forum-cat-icon">'+RULE_ICON+'</span><span class="ds-forum-cat-main"><strong>Reguli &amp; Informatii</strong><small>Regulile guildei, comportament si informatii importante.</small></span><span class="ds-forum-stat">Tip<b>Info</b></span><span class="ds-forum-stat">Acces<b>Toți</b></span><span class="ds-forum-last"><span><strong>Regulile DARKSLAYERS</strong>Citeste inainte de activitatile guildei.</span></span>';
 row.onclick=function(){if(typeof window.openHub==='function')window.openHub('rules');};
 if(title&&title.nextSibling)group.insertBefore(row,title.nextSibling);else group.appendChild(row);
}
function boot(){
 hideOldHub();addRules();
 const root=document.getElementById('forumTopics');
 if(root)new MutationObserver(()=>setTimeout(addRules,0)).observe(root,{childList:true,subtree:true});
 setTimeout(addRules,150);setTimeout(addRules,700);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();