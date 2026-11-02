/* DARKSLAYERS - move old Guild Hub rules into Forum */
(function(){
'use strict';
const RULE_ICON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18H6z"/><path d="M9 7h6M9 11h6M9 15h4"/><path d="M4 5h2M4 9h2M4 13h2M4 17h2"/></svg>';
function ensureFilter(){
 const filter=document.getElementById('forumCategoryFilter');
 if(filter && ![...filter.options].some(o=>o.value==='Reguli')){const o=document.createElement('option');o.value='Reguli';o.textContent='Reguli & Informatii';filter.insertBefore(o,filter.options[1]||null)}
 return filter;
}
function openRules(){
 const filter=ensureFilter();if(!filter)return;filter.value='Reguli';
 filter.dispatchEvent(new Event('change',{bubbles:true}));
}
function addRulesCard(){
 const home=document.querySelector('#forumTopics .ds-forum-home');if(!home)return;
 const group=home.querySelector('.ds-forum-group');if(!group||group.querySelector('[data-ds-rules="1"]'))return;
 const b=document.createElement('button');b.className='ds-forum-cat';b.dataset.dsRules='1';
 b.innerHTML='<span class="ds-forum-cat-icon">'+RULE_ICON+'</span><span class="ds-forum-cat-main"><strong>Reguli &amp; Informatii</strong><small>Regulile guildei, comportament si informatii importante.</small></span><span class="ds-forum-stat">Subiecte<b>0</b></span><span class="ds-forum-stat">Mesaje<b>0</b></span><span class="ds-forum-last"><span>Fara<br>postari</span></span>';
 b.onclick=openRules;
 const title=group.querySelector('.ds-forum-group-title');title.insertAdjacentElement('afterend',b);
 if(typeof darkslayersSupabase!=='undefined'&&darkslayersSupabase){(async()=>{try{const t=await darkslayersSupabase.from('forum_topics').select('id,title,created_at,author_id',{count:'exact'}).eq('category','Reguli').order('created_at',{ascending:false}).limit(1);const ids=(await darkslayersSupabase.from('forum_topics').select('id').eq('category','Reguli')).data||[];let replies=0;if(ids.length){const r=await darkslayersSupabase.from('forum_replies').select('id',{count:'exact',head:true}).in('topic_id',ids.map(x=>x.id));replies=r.count||0}const nums=b.querySelectorAll('.ds-forum-stat b');nums[0].textContent=t.count||0;nums[1].textContent=(t.count||0)+replies;const last=t.data&&t.data[0];if(last){const pm=await loadForumPublicProfiles([last.author_id]);const p=pm.get(last.author_id)||{};b.querySelector('.ds-forum-last').innerHTML=darkslayersAvatarHtml(p,'ds-avatar-small')+'<span><strong>'+String(last.title||'Reguli')+'</strong>de '+String(p.display_name||'Membru')+'<br>'+forumDate(last.created_at)+'</span>'}}catch(e){console.error('Rules forum card:',e)}})()}
}
function apply(){
 const hub=document.getElementById('hub');if(hub)hub.style.display='none';
 document.querySelectorAll('a[href="#hub"]').forEach(a=>a.style.display='none');
 ensureFilter();addRulesCard();
}
function boot(){apply();const box=document.getElementById('forumTopics');if(box)new MutationObserver(()=>setTimeout(addRulesCard,0)).observe(box,{childList:true,subtree:true});setTimeout(apply,200);setTimeout(apply,800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();