/* DARKSLAYERS - forum category page polish PERFORMANCE */
(function(){
'use strict';
function install(){
 if(document.getElementById('ds-forum-category-polish')) return;
 const s=document.createElement('style');
 s.id='ds-forum-category-polish';
 s.textContent=`
#forumTopics .ds-forum-breadcrumb{min-height:42px;padding:9px 14px!important;margin-bottom:8px!important;border:1px solid #552027!important;background:linear-gradient(90deg,#100708,#080505)!important}
#forumTopics .ds-forum-breadcrumb button{color:#e0aa39!important;font-size:12px!important;text-transform:uppercase!important;letter-spacing:.5px!important}
#forumTopics .ds-forum-category-head{padding:11px 16px!important;margin-bottom:10px!important;border:1px solid #70242a!important;border-left:4px solid #b52e36!important;background:linear-gradient(90deg,#4a0c11,#21070a 42%,#0b0607)!important}
#forumTopics .ds-forum-category-head strong{font:900 17px Georgia,serif!important;color:#f1dfc7!important}#forumTopics .ds-forum-category-head small{display:block;margin-top:3px;color:#a98b80!important}
#forumTopics .forum-topic{display:grid!important;grid-template-columns:105px 52px minmax(300px,1fr) 94px 94px minmax(255px,310px)!important;gap:12px!important;align-items:center!important;min-height:82px!important;padding:9px 14px!important;margin:0 0 6px!important;border:1px solid #43171b!important;border-left:4px solid #8f252c!important;background:linear-gradient(90deg,#15090a,#090606 55%,#100708)!important;box-sizing:border-box!important}
#forumTopics .forum-topic:hover{transform:none!important;border-left-color:#d7a63a!important;background:linear-gradient(90deg,#210b0e,#0c0708 55%,#16090b)!important}
#forumTopics .forum-topic-category{grid-column:1!important;min-width:0!important;width:100%!important;margin:0!important;padding:6px 7px!important;border:1px solid #6b2229!important;background:#200a0d!important;color:#dbae42!important;font:900 9px Arial,sans-serif!important;text-align:center!important;box-sizing:border-box!important}
#forumTopics .ds-inline-forum-class{grid-column:2!important;width:48px!important;height:48px!important;margin:0!important;border:1px solid #8d252b!important;border-radius:4px!important;background:#070505!important;box-shadow:0 0 8px rgba(185,27,35,.22)!important}
#forumTopics .forum-topic-main{grid-column:3!important;min-width:0!important;text-align:left!important;margin:0!important;padding:0!important}#forumTopics .forum-topic-main strong{display:block!important;color:#f0dfc7!important;font:900 15px Georgia,serif!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}#forumTopics .forum-topic-main small{display:block!important;margin-top:5px!important;color:#927e77!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}#forumTopics .forum-topic-arrow{display:none!important}
#forumTopics .ds-cat-stat{width:94px!important;height:52px!important;padding:6px 4px!important;border:1px solid #4a2528!important;background:#0d0808!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important;text-transform:uppercase!important;color:#9d8880!important;font:400 8px Arial,sans-serif!important;line-height:1.1!important;box-sizing:border-box!important;white-space:nowrap!important}#forumTopics .ds-cat-stat b{display:block!important;margin-top:5px!important;color:#f0dfc6!important;font:900 17px Georgia,serif!important;line-height:1!important}
#forumTopics .ds-cat-last{min-width:0;height:52px;display:grid;grid-template-columns:40px minmax(0,1fr);gap:9px;align-items:center;padding:5px 7px;border-left:1px solid #321619;color:#8d7b74;font-size:9px;line-height:1.25;overflow:hidden;box-sizing:border-box}#forumTopics .ds-cat-last strong{display:block;color:#e3cba9;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px}#forumTopics .ds-cat-last small{display:block;color:#89736b;font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ds-cat-last-avatar{width:38px;height:38px;border:1px solid #7d292f;border-radius:3px;overflow:hidden;background:#080505}.ds-cat-last-avatar img{width:100%;height:100%;object-fit:cover;display:block}
@media(max-width:1180px){#forumTopics .forum-topic{grid-template-columns:90px 48px minmax(220px,1fr) 90px 90px minmax(200px,240px)!important;gap:10px!important}#forumTopics .ds-cat-stat{width:90px!important}}@media(max-width:950px){#forumTopics .forum-topic{grid-template-columns:90px 46px minmax(220px,1fr) 88px 88px!important}#forumTopics .ds-cat-stat{width:88px!important}#forumTopics .ds-cat-last{display:none!important}}@media(max-width:760px){#forumTopics .forum-topic{grid-template-columns:42px minmax(0,1fr) 76px!important}.forum-topic-category,#forumTopics .ds-cat-stat:nth-of-type(2),#forumTopics .ds-cat-last{display:none!important}#forumTopics .ds-inline-forum-class{grid-column:1!important;width:40px!important;height:40px!important}#forumTopics .forum-topic-main{grid-column:2!important}#forumTopics .ds-cat-stat{grid-column:3!important;width:76px!important}}
`;document.head.appendChild(s);
}
function safe(v){return String(v||'').replace(/[<>&"']/g,'');}
function topicId(row){const m=(row.getAttribute('onclick')||'').match(/openForumTopic\((\d+)\)/);return m?Number(m[1]):0;}
const LIVE=new Map();
async function loadTopicInfo(id){
 if(!id||typeof darkslayersSupabase==='undefined'||!darkslayersSupabase)return null;
 if(LIVE.has(id))return LIVE.get(id);
 const rr=await darkslayersSupabase.from('forum_replies').select('id,created_at,author_id').eq('topic_id',id).order('created_at',{ascending:false});
 if(rr.error){console.error('Forum replies stats:',rr.error);return null;}
 const rows=rr.data||[];const info={replies:rows.length,last:rows[0]||null};LIVE.set(id,info);return info;
}
async function fillLive(row,id,originalMeta,classPic){
 if(row.dataset.dsLiveLoaded==='1')return;row.dataset.dsLiveLoaded='1';
 const stats=row.querySelectorAll('.ds-cat-stat b');if(!id||stats.length<2)return;
 const info=await loadTopicInfo(id);if(!info){row.dataset.dsLiveLoaded='';return;}
 stats[0].textContent=String(info.replies);stats[1].textContent=String(info.replies+1);
 const last=row.querySelector('.ds-cat-last');if(!last)return;
 let lastText=originalMeta||'';let avatarSrc=classPic&&classPic.src?classPic.src:'';
 if(info.last){
  const pm=await loadForumPublicProfiles([info.last.author_id]);const p=pm.get(info.last.author_id)||{};const c=p.main_character||null;
  last.dataset.userId=info.last.author_id||'';
  lastText=`de ${p.display_name||'Membru'} • ${(p.role||'member').toUpperCase()}${c?' • '+(c.class||'')+' • '+(c.spec||''):''} • ${forumDate(info.last.created_at)}`;
  const holder=document.createElement('div');holder.innerHTML=darkslayersAvatarHtml(p,'ds-avatar-small');const img=holder.querySelector('img');if(img&&img.src)avatarSrc=img.src;
 }
 const av=last.querySelector('.ds-cat-last-avatar');if(av){av.innerHTML='';if(avatarSrc){const img=document.createElement('img');img.src=avatarSrc;img.alt='';av.appendChild(img)}}
 const sm=last.querySelector('small');if(sm)sm.textContent=lastText;
 if(typeof window.refreshForumRewards==='function')window.refreshForumRewards();
}
function enhance(){
 install();const box=document.getElementById('forumTopics');if(!box||!box.querySelector('.ds-forum-category-head'))return;
 box.querySelectorAll('.forum-topic').forEach(row=>{
  const main=row.querySelector('.forum-topic-main'),meta=main&&main.querySelector('small'),arrow=row.querySelector('.forum-topic-arrow');if(!main||!arrow)return;
  const text=(meta?.textContent||'').trim(),classPic=row.querySelector('.ds-inline-forum-class img');
  let stat1=row.querySelector('.ds-cat-stat[data-stat="replies"]'),stat2=row.querySelector('.ds-cat-stat[data-stat="messages"]'),last=row.querySelector('.ds-cat-last');
  if(!stat1){stat1=document.createElement('span');stat1.className='ds-cat-stat';stat1.dataset.stat='replies';stat1.innerHTML='<span>Raspunsuri</span><b>0</b>';stat1.style.gridColumn='4';row.insertBefore(stat1,arrow)}
  if(!stat2){stat2=document.createElement('span');stat2.className='ds-cat-stat';stat2.dataset.stat='messages';stat2.innerHTML='<span>Mesaje</span><b>1</b>';stat2.style.gridColumn='5';row.insertBefore(stat2,arrow)}
  if(!last){last=document.createElement('span');last.className='ds-cat-last';last.style.gridColumn='6';const av=document.createElement('span');av.className='ds-cat-last-avatar';if(classPic&&classPic.src){const img=document.createElement('img');img.src=classPic.src;img.alt='';av.appendChild(img)}last.appendChild(av);const info=document.createElement('span');info.innerHTML='<strong>Ultima postare</strong><small>'+safe(text)+'</small>';last.appendChild(info);row.insertBefore(last,arrow)}
  arrow.style.display='none';row.dataset.dsCategoryPolished='1';fillLive(row,topicId(row),text,classPic);
 });
}
let et=0;function schedule(){clearTimeout(et);et=setTimeout(enhance,60)}
function boot(){install();enhance();const box=document.getElementById('forumTopics');if(box)new MutationObserver(schedule).observe(box,{childList:true});setTimeout(enhance,300)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.refreshForumCategoryPolish=enhance;
})();