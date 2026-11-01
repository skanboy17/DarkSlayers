/* DARKSLAYERS - FORUM COMBAT ROLE ICONS */
(function(){
'use strict';
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]})}
function norm(v){return String(v||'').trim().toLowerCase()}
function inferRole(cls,spec){
  cls=norm(cls);spec=norm(spec);
  if(['protection','blood','guardian','brewmaster','vengeance'].includes(spec)) return 'tank';
  if(['restoration','holy','discipline','mistweaver','preservation'].includes(spec)) return 'healer';
  if(cls==='hunter'||cls==='mage'||cls==='warlock'||(cls==='priest'&&spec==='shadow')||(cls==='druid'&&spec==='balance')||(cls==='shaman'&&spec==='elemental')) return 'ranged';
  return 'melee';
}
function label(k){return {tank:'TANK',healer:'HEALER',ranged:'RANGED DPS',melee:'MELEE DPS'}[k]}
function icon(k){
 if(k==='tank')return '<span class="ds-forum-role-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 20 5v6c0 5.2-3.4 9.3-8 11-4.6-1.7-8-5.8-8-11V5l8-3Zm0 3L7 7v4c0 3.5 2 6.4 5 8 3-1.6 5-4.5 5-8V7l-5-2Z"/></svg></span>';
 if(k==='healer')return '<span class="ds-forum-role-icon">✚</span>';
 if(k==='ranged')return '<span class="ds-forum-role-icon">🏹</span>';
 return '<span class="ds-forum-role-icon">⚔</span>';
}
function css(){if(document.getElementById('ds-forum-role-css'))return;var s=document.createElement('style');s.id='ds-forum-role-css';s.textContent='.ds-forum-combat{display:inline-flex;align-items:center;gap:4px;font-weight:900;margin-left:4px}.ds-forum-combat.tank{color:#248cff}.ds-forum-combat.healer{color:#25d968}.ds-forum-combat.melee{color:#ff3c3c}.ds-forum-combat.ranged{color:#ff9d2d}.ds-forum-role-icon{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;font-size:13px;vertical-align:middle}.ds-forum-role-icon svg{width:15px;height:15px;fill:currentColor}';document.head.appendChild(s)}
function apply(){
 css();
 document.querySelectorAll('.forum-topic-main small').forEach(function(el){
   if(el.querySelector('.ds-forum-combat'))return;
   var txt=(el.textContent||'').trim();
   var parts=txt.split('•').map(function(x){return x.trim()});
   if(parts.length<5)return;
   var cls=parts[2]||'',spec=parts[3]||'';
   var k=inferRole(cls,spec);
   var date=parts.slice(4).join(' • ');
   var before=parts.slice(0,4).join(' • ');
   el.innerHTML=esc(before)+' • <span class="ds-forum-combat '+k+'">'+icon(k)+esc(label(k))+'</span> • '+esc(date);
 });
}
var timer=null;function schedule(){clearTimeout(timer);timer=setTimeout(apply,80)}
function start(){css();var box=document.getElementById('forumTopics');if(box)new MutationObserver(schedule).observe(box,{childList:true,subtree:true});schedule();setTimeout(apply,400);setTimeout(apply,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
window.refreshForumRoleIcons=apply;
})();