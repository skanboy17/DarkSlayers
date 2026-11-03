/* DARKSLAYERS - FORUM CLASS ICONS - DIRECT RENDER */
(function(){
'use strict';

const CLASS_ICONS={
 'warrior':'images/warrior.png','paladin':'images/paladin.png','death knight':'images/death-knight.png',
 'druid':'images/druid.png','hunter':'images/hunter.png','rogue':'images/rogue.png','priest':'images/priest.png',
 'shaman':'images/shaman.png','mage':'images/mage.png','warlock':'images/warlock.png','skyborn':'images/skyborn.png'
};

function classIconPath(name){return CLASS_ICONS[String(name||'').trim().toLowerCase()]||'';}
function installCss(){
 if(document.getElementById('ds-forum-direct-class-css'))return;
 const s=document.createElement('style');s.id='ds-forum-direct-class-css';s.textContent=`
 #forumTopics .forum-topic{display:grid!important;grid-template-columns:220px 58px minmax(0,1fr) 40px!important;align-items:center!important;column-gap:14px!important;min-height:86px!important}
 #forumTopics .forum-topic-category{grid-column:1!important}
 #forumTopics .forum-topic-class{grid-column:2!important;width:48px!important;height:48px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;border:1px solid #8d252b!important;border-radius:4px!important;background:#070707!important;box-shadow:0 0 10px rgba(210,25,35,.28)!important}
 #forumTopics .forum-topic-class img{width:100%!important;height:100%!important;display:block!important;object-fit:cover!important}
 #forumTopics .forum-topic-main{grid-column:3!important;min-width:0!important;text-align:left!important}
 #forumTopics .forum-topic-arrow{grid-column:4!important}
 @media(max-width:700px){#forumTopics .forum-topic{grid-template-columns:100px 42px minmax(0,1fr) 24px!important;column-gap:8px!important}#forumTopics .forum-topic-class{width:38px!important;height:38px!important}}
 `;document.head.appendChild(s);
}

const originalLoadForumTopics = (typeof loadForumTopics === 'function') ? loadForumTopics : null;

async function directLoadForumTopics(page){
 const box=document.getElementById('forumTopics');
 if(!box || typeof darkslayersSupabase==='undefined' || !darkslayersSupabase)return;
 installCss();
 page=Math.max(1,Number(page)||1);
 try{DARKSLAYERS_FORUM_PAGE=page;}catch(e){}
 box.innerHTML='<div class="forum-empty">Se incarca forumul...</div>';
 const filter=document.getElementById('forumCategoryFilter')?.value||'all';
 const pageSize=(typeof DARKSLAYERS_FORUM_PAGE_SIZE!=='undefined'?DARKSLAYERS_FORUM_PAGE_SIZE:10);
 const from=(page-1)*pageSize,to=from+pageSize-1;
 let q=darkslayersSupabase.from('forum_topics').select('id,created_at,author_id,category,title,content,pinned',{count:'exact'}).order('pinned',{ascending:false}).order('created_at',{ascending:false}).range(from,to);
 if(filter!=='all')q=q.eq('category',filter);
 const {data,error,count}=await q;
 if(error){console.error(error);box.innerHTML='<div class="forum-empty">Nu am putut incarca forumul.</div>';return;}
 const topics=data||[];
 const totalPages=Math.max(1,Math.ceil((count||0)/pageSize));
 if(page>totalPages)return directLoadForumTopics(totalPages);
 if(!topics.length){box.innerHTML='<div class="forum-empty">Nu exista subiecte inca. Fii primul care scrie!</div>';return;}
 const ids=[...new Set(topics.map(x=>x.author_id))];
 const pmap=await loadForumPublicProfiles(ids);
 let html=topics.map(t=>{
   const p=pmap.get(t.author_id)||{};
   const c=p.main_character||null;
   const icon=c?classIconPath(c.class):'';
   const iconHtml=icon?`<span class="forum-topic-class" title="${escapeHtml(c.class||'Clasa')}"><img src="${icon}?v=direct-forum-1" alt="${escapeHtml(c.class||'Clasa')}"></span>`:`<span class="forum-topic-class" style="visibility:hidden"></span>`;
   return `<button class="forum-topic" onclick="openForumTopic(${Number(t.id)})">
     <span class="forum-topic-category">${t.pinned?'📌 ':''}${escapeHtml(t.category)}</span>
     ${iconHtml}
     <span class="forum-topic-main"><strong>${t.pinned?'📌 ':''}${escapeHtml(t.title)}</strong><small>de ${escapeHtml(p.display_name||'Membru')} • ${(p.role||'member').toUpperCase()}${c?' • '+escapeHtml(c.class)+' • '+escapeHtml(c.spec||''):''} • ${forumDate(t.created_at)}</small></span>
     <span class="forum-topic-arrow">→</span>
   </button>`;
 }).join('');
 if(totalPages>1){
   let pages='';for(let i=1;i<=totalPages;i++)pages+=`<button type="button" onclick="changeForumPage(${i})" ${i===page?'disabled':''}>${i}</button>`;
   html+=`<div class="forum-pagination" style="display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap;margin-top:18px;"><button type="button" onclick="changeForumPage(${page-1})" ${page<=1?'disabled':''}>← INAPOI</button>${pages}<button type="button" onclick="changeForumPage(${page+1})" ${page>=totalPages?'disabled':''}>URMATOAREA →</button></div>`;
 }
 box.innerHTML=html;
}

if(originalLoadForumTopics){
 loadForumTopics=directLoadForumTopics;
 window.loadForumTopics=directLoadForumTopics;
}
window.refreshForumClassIcons=function(){directLoadForumTopics(typeof DARKSLAYERS_FORUM_PAGE!=='undefined'?DARKSLAYERS_FORUM_PAGE:1);};
installCss();
setTimeout(()=>directLoadForumTopics(1),100);
})();