/* DARKSLAYERS - FORUM COMBAT ROLE ICONS */
(function(){
'use strict';

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]})}
function roleKind(role){
  var r=String(role||'').trim().toUpperCase();
  if(r==='TANK') return 'tank';
  if(r==='HEALER') return 'healer';
  if(r.indexOf('RANGED')>=0) return 'ranged';
  return 'melee';
}
function roleLabel(role){
  var k=roleKind(role);
  return {tank:'TANK',healer:'HEALER',ranged:'RANGED DPS',melee:'MELEE DPS'}[k];
}
function icon(k){
  if(k==='tank') return '<span class="ds-forum-role-icon tank"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 20 5v6c0 5.2-3.4 9.3-8 11-4.6-1.7-8-5.8-8-11V5l8-3Zm0 3L7 7v4c0 3.5 2 6.4 5 8 3-1.6 5-4.5 5-8V7l-5-2Z"/></svg></span>';
  if(k==='healer') return '<span class="ds-forum-role-icon healer">✚</span>';
  if(k==='ranged') return '<span class="ds-forum-role-icon ranged">🏹</span>';
  return '<span class="ds-forum-role-icon melee">⚔</span>';
}
function css(){
  if(document.getElementById('ds-forum-role-css')) return;
  var s=document.createElement('style');s.id='ds-forum-role-css';
  s.textContent='.ds-forum-combat{display:inline-flex;align-items:center;gap:4px;font-weight:900;margin:0 2px}.ds-forum-combat.tank{color:#248cff}.ds-forum-combat.healer{color:#25d968}.ds-forum-combat.melee{color:#ff3c3c}.ds-forum-combat.ranged{color:#ff9d2d}.ds-forum-role-icon{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;font-size:13px;vertical-align:middle}.ds-forum-role-icon svg{width:15px;height:15px;fill:currentColor}';
  document.head.appendChild(s);
}
async function profileMap(){
  if(typeof darkslayersSupabase==='undefined'||!darkslayersSupabase) return new Map();
  var pr=await darkslayersSupabase.from('profiles').select('id,display_name');
  if(pr.error) return new Map();
  var profiles=pr.data||[],ids=profiles.map(function(p){return p.id});
  if(!ids.length) return new Map();
  var cr=await darkslayersSupabase.from('characters').select('user_id,combat_role,is_main').in('user_id',ids).eq('is_main',true);
  if(cr.error) return new Map();
  var roles=new Map((cr.data||[]).map(function(c){return [c.user_id,c.combat_role]}));
  var map=new Map();
  profiles.forEach(function(p){if(p.display_name&&roles.get(p.id)) map.set(String(p.display_name).trim().toLowerCase(),roles.get(p.id))});
  return map;
}
var busy=false;
async function apply(){
  if(busy) return; busy=true;
  try{
    css();
    var map=await profileMap();
    document.querySelectorAll('.forum-topic-main small').forEach(function(el){
      el.querySelectorAll('.ds-forum-combat').forEach(function(x){x.remove()});
      var txt=el.textContent||'';
      var m=txt.match(/^de\s+([^•]+)\s*•/i); if(!m) return;
      var role=map.get(m[1].trim().toLowerCase()); if(!role) return;
      var parts=Array.from(el.childNodes);
      var dateSep=null;
      for(var i=parts.length-1;i>=0;i--){if(parts[i].nodeType===3&&parts[i].textContent.indexOf(' • ')>=0){dateSep=parts[i];break}}
      var k=roleKind(role),span=document.createElement('span');span.className='ds-forum-combat '+k;span.innerHTML=icon(k)+esc(roleLabel(role));
      if(dateSep){dateSep.parentNode.insertBefore(document.createTextNode(' • '),dateSep);dateSep.parentNode.insertBefore(span,dateSep)}else{el.appendChild(document.createTextNode(' • '));el.appendChild(span)}
    });
  }finally{busy=false}
}
var timer=null;
function schedule(){clearTimeout(timer);timer=setTimeout(apply,120)}
var obs=new MutationObserver(schedule);
function start(){css();var box=document.getElementById('forumTopics');if(box)obs.observe(box,{childList:true,subtree:true});schedule();setTimeout(apply,700)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
window.refreshForumRoleIcons=apply;
})();