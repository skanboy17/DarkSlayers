/* DARKSLAYERS - FORUM CLASS IMAGE BETWEEN CATEGORY AND TOPIC */
(function(){
'use strict';
const icons={warrior:'images/warrior.png',paladin:'images/paladin.png','death knight':'images/death-knight.png',druid:'images/druid.png',hunter:'images/hunter.png',rogue:'images/rogue.png',priest:'images/priest.png',shaman:'images/shaman.png',mage:'images/mage.png',warlock:'images/warlock.png',skyborn:'images/skyborn.png'};
function norm(v){return String(v||'').trim().toLowerCase();}
function css(){if(document.getElementById('ds-forum-class-layout-css'))return;const s=document.createElement('style');s.id='ds-forum-class-layout-css';s.textContent=`
.forum-topic{display:grid!important;grid-template-columns:220px 58px minmax(0,1fr) 40px!important;align-items:center!important;column-gap:14px!important;min-height:86px!important}
.forum-topic-category{grid-column:1!important;align-self:center!important}
.ds-forum-class-box{grid-column:2!important;width:48px!important;height:48px!important;display:flex!important;align-items:center!important;justify-content:center!important;border:1px solid #8d252b!important;border-radius:4px!important;background:#070707!important;box-shadow:0 0 10px rgba(210,25,35,.22)!important;overflow:hidden!important}
.ds-forum-class-box img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}
.forum-topic-main{grid-column:3!important;min-width:0!important;text-align:left!important}
.forum-topic-main small{display:block!important;min-height:0!important}
.forum-topic-arrow{grid-column:4!important}
@media(max-width:700px){.forum-topic{grid-template-columns:110px 42px minmax(0,1fr) 24px!important;column-gap:8px!important}.ds-forum-class-box{width:36px!important;height:36px!important}}
`;document.head.appendChild(s)}
function decorate(){css();document.querySelectorAll('.forum-topic').forEach(function(topic){const main=topic.querySelector('.forum-topic-main');const meta=main&&main.querySelector('small');if(!main||!meta)return;const raw=(meta.textContent||'').replace(/\s+/g,' ').trim();const parts=raw.split('•').map(x=>x.trim());if(parts.length<4)return;const cls=norm(parts[2]);const src=icons[cls];if(!src)return;let box=topic.querySelector('.ds-forum-class-box');if(!box){box=document.createElement('span');box.className='ds-forum-class-box';topic.insertBefore(box,main)}if(box.dataset.cls!==cls){box.dataset.cls=cls;box.title=parts[2];box.innerHTML='';const img=document.createElement('img');img.src=new URL(src,document.baseURI).href;img.alt=parts[2];box.appendChild(img)}})}
function start(){css();decorate();const root=document.getElementById('forumTopics')||document.body;new MutationObserver(function(){setTimeout(decorate,10)}).observe(root,{childList:true,subtree:true});let n=0;const timer=setInterval(function(){decorate();if(++n>30)clearInterval(timer)},300)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();window.refreshForumClassIcons=decorate;
})();
