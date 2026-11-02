/* DARKSLAYERS - forum category page polish */
(function(){
'use strict';
function install(){
 if(document.getElementById('ds-forum-category-polish')) return;
 const s=document.createElement('style');
 s.id='ds-forum-category-polish';
 s.textContent=`
#forumTopics .ds-forum-breadcrumb{min-height:42px;padding:9px 14px!important;margin-bottom:8px!important;border:1px solid #552027!important;background:linear-gradient(90deg,#100708,#080505)!important;box-shadow:inset 0 1px rgba(255,255,255,.02)!important}
#forumTopics .ds-forum-breadcrumb button{color:#e0aa39!important;font-size:12px!important;text-transform:uppercase!important;letter-spacing:.5px!important}
#forumTopics .ds-forum-category-head{padding:11px 16px!important;margin-bottom:10px!important;border:1px solid #70242a!important;border-left:4px solid #b52e36!important;background:linear-gradient(90deg,#4a0c11 0,#21070a 42%,#0b0607 100%)!important;box-shadow:inset 0 0 18px rgba(0,0,0,.35)!important}
#forumTopics .ds-forum-category-head strong{font:900 17px Georgia,serif!important;color:#f1dfc7!important;text-shadow:0 1px 4px #000!important}
#forumTopics .ds-forum-category-head small{display:block;margin-top:3px;color:#a98b80!important}
#forumTopics .forum-topic{display:grid!important;grid-template-columns:112px 52px minmax(300px,1fr) 82px 82px minmax(210px,270px)!important;gap:10px!important;align-items:center!important;min-height:78px!important;padding:8px 12px!important;margin:0 0 6px!important;border:1px solid #43171b!important;border-left:4px solid #8f252c!important;background:linear-gradient(90deg,#15090a 0,#090606 55%,#100708 100%)!important;box-sizing:border-box!important;transition:border-color .16s ease,background .16s ease!important}
#forumTopics .forum-topic:hover{transform:none!important;border-left-color:#d7a63a!important;background:linear-gradient(90deg,#210b0e 0,#0c0708 55%,#16090b 100%)!important}
#forumTopics .forum-topic-category{grid-column:1!important;min-width:0!important;width:100%!important;margin:0!important;padding:6px 7px!important;border:1px solid #6b2229!important;background:#200a0d!important;color:#dbae42!important;font:900 9px Arial,sans-serif!important;text-align:center!important;box-sizing:border-box!important}
#forumTopics .ds-inline-forum-class{grid-column:2!important;width:48px!important;height:48px!important;margin:0!important;border:1px solid #8d252b!important;border-radius:4px!important;background:#070505!important;box-shadow:0 0 8px rgba(185,27,35,.22)!important}
#forumTopics .forum-topic-main{grid-column:3!important;min-width:0!important;text-align:left!important;margin:0!important;padding:0!important}
#forumTopics .forum-topic-main strong{display:block!important;color:#f0dfc7!important;font:900 15px Georgia,serif!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#forumTopics .forum-topic-main small{display:block!important;margin-top:5px!important;color:#927e77!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#forumTopics .forum-topic-arrow{grid-column:6!important;justify-self:end!important;color:#d3a23a!important;font-size:22px!important}
#forumTopics .ds-cat-stat,#forumTopics .ds-cat-last{min-width:0!important}
#forumTopics .ds-cat-stat{height:43px;border:1px solid #3d2023;background:#0a0707;display:flex;flex-direction:column;align-items:center;justify-content:center;text-transform:uppercase;color:#8d7b74;font-size:8px;line-height:1.05}
#forumTopics .ds-cat-stat b{margin-top:3px;color:#eee0c8;font-size:14px}
#forumTopics .ds-cat-last{display:flex;align-items:center;gap:8px;color:#8d7b74;font-size:9px;line-height:1.25;overflow:hidden}
#forumTopics .ds-cat-last strong{display:block;color:#d9c9b7;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#forumTopics .ds-cat-last small{display:block;color:#806e68;font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#forumTopics .ds-cat-last-avatar{width:34px;height:34px;flex:0 0 34px;border:1px solid #76242a;border-radius:3px;overflow:hidden;background:#080505}
#forumTopics .ds-cat-last-avatar img{width:100%;height:100%;object-fit:cover;display:block}
@media(max-width:1100px){#forumTopics .forum-topic{grid-template-columns:100px 46px minmax(220px,1fr) 68px 68px!important}#forumTopics .forum-topic-arrow{grid-column:5!important}.ds-cat-last{display:none!important}}
@media(max-width:760px){#forumTopics .forum-topic{grid-template-columns:42px minmax(0,1fr) 28px!important;min-height:68px!important}.forum-topic-category,.ds-cat-stat,.ds-cat-last{display:none!important}#forumTopics .ds-inline-forum-class{grid-column:1!important;width:40px!important;height:40px!important}#forumTopics .forum-topic-main{grid-column:2!important}#forumTopics .forum-topic-arrow{grid-column:3!important}}
`;
 document.head.appendChild(s);
}
function enhance(){
 install();
 const box=document.getElementById('forumTopics');
 if(!box || !box.querySelector('.ds-forum-category-head')) return;
 box.querySelectorAll('.forum-topic').forEach(row=>{
   if(row.dataset.dsCategoryPolished==='1') return;
   const main=row.querySelector('.forum-topic-main');
   const meta=main&&main.querySelector('small');
   const arrow=row.querySelector('.forum-topic-arrow');
   if(!main||!arrow) return;
   const text=(meta?.textContent||'').trim();
   const stat1=document.createElement('span'); stat1.className='ds-cat-stat'; stat1.innerHTML='<span>Raspunsuri</span><b>—</b>';
   const stat2=document.createElement('span'); stat2.className='ds-cat-stat'; stat2.innerHTML='<span>Vizualizari</span><b>—</b>';
   const last=document.createElement('span'); last.className='ds-cat-last'; last.innerHTML='<span><strong>Ultima postare</strong><small>'+text.replace(/[<>&]/g,'')+'</small></span>';
   row.insertBefore(stat1,arrow); row.insertBefore(stat2,arrow); row.insertBefore(last,arrow);
   stat1.style.gridColumn='4'; stat2.style.gridColumn='5'; last.style.gridColumn='6'; arrow.style.display='none';
   row.dataset.dsCategoryPolished='1';
 });
}
function boot(){install();enhance();const box=document.getElementById('forumTopics');if(box)new MutationObserver(()=>setTimeout(enhance,0)).observe(box,{childList:true,subtree:true});setTimeout(enhance,250);setTimeout(enhance,800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.refreshForumCategoryPolish=enhance;
})();