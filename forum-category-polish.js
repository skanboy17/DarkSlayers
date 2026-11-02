/* DARKSLAYERS - forum category page polish */
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
#forumTopics .forum-topic{display:grid!important;grid-template-columns:105px 52px minmax(300px,1fr) 92px 92px minmax(255px,310px)!important;gap:10px!important;align-items:center!important;min-height:82px!important;padding:9px 14px!important;margin:0 0 6px!important;border:1px solid #43171b!important;border-left:4px solid #8f252c!important;background:linear-gradient(90deg,#15090a,#090606 55%,#100708)!important;box-sizing:border-box!important}
#forumTopics .forum-topic:hover{transform:none!important;border-left-color:#d7a63a!important;background:linear-gradient(90deg,#210b0e,#0c0708 55%,#16090b)!important}
#forumTopics .forum-topic-category{grid-column:1!important;min-width:0!important;width:100%!important;margin:0!important;padding:6px 7px!important;border:1px solid #6b2229!important;background:#200a0d!important;color:#dbae42!important;font:900 9px Arial,sans-serif!important;text-align:center!important;box-sizing:border-box!important}
#forumTopics .ds-inline-forum-class{grid-column:2!important;width:48px!important;height:48px!important;margin:0!important;border:1px solid #8d252b!important;border-radius:4px!important;background:#070505!important;box-shadow:0 0 8px rgba(185,27,35,.22)!important}
#forumTopics .forum-topic-main{grid-column:3!important;min-width:0!important;text-align:left!important;margin:0!important;padding:0!important}#forumTopics .forum-topic-main strong{display:block!important;color:#f0dfc7!important;font:900 15px Georgia,serif!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}#forumTopics .forum-topic-main small{display:block!important;margin-top:5px!important;color:#927e77!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}#forumTopics .forum-topic-arrow{display:none!important}
#forumTopics .ds-cat-stat{height:48px;border:1px solid #4a2528;background:linear-gradient(180deg,#100909,#080606);display:flex;flex-direction:column;align-items:center;justify-content:center;text-transform:uppercase;color:#9d8880;font-size:8px;line-height:1.1;box-sizing:border-box}#forumTopics .ds-cat-stat b{margin-top:4px;color:#f0dfc6;font-size:15px;line-height:1}
#forumTopics .ds-cat-last{min-width:0;height:52px;display:grid;grid-template-columns:40px minmax(0,1fr);gap:9px;align-items:center;padding:5px 7px;border-left:1px solid #321619;color:#8d7b74;font-size:9px;line-height:1.25;overflow:hidden;box-sizing:border-box}#forumTopics .ds-cat-last strong{display:block;color:#e3cba9;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px}#forumTopics .ds-cat-last small{display:block;color:#89736b;font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ds-cat-last-avatar{width:38px;height:38px;border:1px solid #7d292f;border-radius:3px;overflow:hidden;background:#080505}.ds-cat-last-avatar img{width:100%;height:100%;object-fit:cover;display:block}
@media(max-width:1180px){#forumTopics .forum-topic{grid-template-columns:90px 48px minmax(220px,1fr) 76px 76px minmax(200px,240px)!important}}@media(max-width:950px){#forumTopics .forum-topic{grid-template-columns:90px 46px minmax(220px,1fr) 72px 72px!important}#forumTopics .ds-cat-last{display:none!important}}@media(max-width:760px){#forumTopics .forum-topic{grid-template-columns:42px minmax(0,1fr) 58px!important}.forum-topic-category,#forumTopics .ds-cat-stat:nth-of-type(2),#forumTopics .ds-cat-last{display:none!important}#forumTopics .ds-inline-forum-class{grid-column:1!important;width:40px!important;height:40px!important}#forumTopics .forum-topic-main{grid-column:2!important}#forumTopics .ds-cat-stat{grid-column:3!important}}
`;document.head.appendChild(s);
}
function safe(v){return String(v||'').replace(/[<>&"']/g,'');}
function topicId(row){const m=(row.getAttribute('onclick')||'').match(/openForumTopic\((\d+)\)/);return m?Number(m[1]):0;}
async function fillStats(row,id){
 const stats=row.querySelectorAll('.ds-cat-stat b'); if(!id||stats.length<2||!window.darkslayersSupabase)return;
 const rr=await darkslayersSupabase.from('forum_replies').select('id',{count:'exact',head:true}).eq('topic_id',id);
 if(!rr.error)stats[0].textContent=String(rr.count||0);
 const vr=await darkslayersSupabase.from('forum_topics').select('views').eq('id',id).maybeSingle();
 if(!vr.error&&vr.data&&vr.data.views!=null)stats[1].textContent=String(Number(vr.data.views)||0);else stats[1].textContent='0';
}
function enhance(){
 install();const box=document.getElementById('forumTopics');if(!box||!box.querySelector('.ds-forum-category-head'))return;
 box.querySelectorAll('.forum-topic').forEach(row=>{
  if(row.dataset.dsCategoryPolished==='1')return;const main=row.querySelector('.forum-topic-main'),meta=main&&main.querySelector('small'),arrow=row.querySelector('.forum-topic-arrow');if(!main||!arrow)return;
  const text=(meta?.textContent||'').trim(),classPic=row.querySelector('.ds-inline-forum-class img');
  const stat1=document.createElement('span');stat1.className='ds-cat-stat';stat1.innerHTML='<span>Raspunsuri</span><b>0</b>';stat1.style.gridColumn='4';
  const stat2=document.createElement('span');stat2.className='ds-cat-stat';stat2.innerHTML='<span>Vizualizari</span><b>0</b>';stat2.style.gridColumn='5';
  const last=document.createElement('span');last.className='ds-cat-last';last.style.gridColumn='6';const av=document.createElement('span');av.className='ds-cat-last-avatar';if(classPic&&classPic.src){const img=document.createElement('img');img.src=classPic.src;img.alt='';av.appendChild(img)}last.appendChild(av);const info=document.createElement('span');info.innerHTML='<strong>Ultima postare</strong><small>'+safe(text)+'</small>';last.appendChild(info);
  row.insertBefore(stat1,arrow);row.insertBefore(stat2,arrow);row.insertBefore(last,arrow);arrow.style.display='none';row.dataset.dsCategoryPolished='1';fillStats(row,topicId(row));
 });
}
function boot(){install();enhance();const box=document.getElementById('forumTopics');if(box)new MutationObserver(()=>setTimeout(enhance,0)).observe(box,{childList:true,subtree:true});setTimeout(enhance,250);setTimeout(enhance,800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();window.refreshForumCategoryPolish=enhance;
})();