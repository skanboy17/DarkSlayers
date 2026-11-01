/* DARKSLAYERS - FORUM CLASS IMAGE BETWEEN CATEGORY AND TOPIC */
(function(){
'use strict';
const icons={warrior:'images/warrior.png',paladin:'images/paladin.png','death knight':'images/death-knight.png',druid:'images/druid.png',hunter:'images/hunter.png',rogue:'images/rogue.png',priest:'images/priest.png',shaman:'images/shaman.png',mage:'images/mage.png',warlock:'images/warlock.png',skyborn:'images/skyborn.png'};
function norm(v){return String(v||'').trim().toLowerCase();}
function findClass(text){const t=norm(text);return Object.keys(icons).find(function(cls){return new RegExp('(^|\\s|•)'+cls.replace(' ','\\s+')+'($|\\s|•)','i').test(t)})||null}
function css(){if(document.getElementById('ds-forum-class-layout-css-v3'))return;const s=document.createElement('style');s.id='ds-forum-class-layout-css-v3';s.textContent=`
.forum-topic{display:grid!important;grid-template-columns:220px 58px minmax(0,1fr) 40px!important;align-items:center!important;column-gap:14px!important;min-height:86px!important}
.forum-topic-category{grid-column:1!important;align-self:center!important}
.ds-forum-class-box{grid-column:2!important;width:48px!important;height:48px!important;display:flex!important;align-items:center!important;justify-content:center!important;border:1px solid #8d252b!important;border-radius:4px!important;background:#070707!important;box-shadow:0 0 10px rgba(210,25,35,.22)!important;overflow:hidden!important}
.ds-forum-class-box img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}
.forum-topic-main{grid-column:3!important;min-width:0!important;text-align:left!important}
.forum-topic-arrow{grid-column:4!important}
@media(max-width:700px){.forum-topic{grid-template-columns:105px 42px minmax(0,1fr) 24px!important;column-gap:8px!important}.ds-forum-class-box{width:36px!important;height:36px!important}}
`;document.head.appendChild(s)}
function decorate(){css();document.querySelectorAll('.forum-topic').forEach(function(topic){const main=topic.querySelector('.forum-topic-main');if(!main)return;const meta=main.querySelector('small');const raw=(meta?meta.textContent:main.textContent||'').replace(/\s+/g,' ').trim();const cls=findClass(raw);if(!cls)return;let box=topic.querySelector('.ds-forum-class-box');if(!box){box=document.createElement('span');box.className='ds-forum-class-box';topic.insertBefore(box,main)}if(box.dataset.cls!==cls){box.dataset.cls=cls;box.title=cls.replace(/\b\w/g,function(c){return c.toUpperCase()});box.innerHTML='';const img=document.createElement('img');img.src=icons[cls]+'?v=forum-class-v3';img.alt=box.title;box.appendChild(img)}})}
function start(){css();decorate();const root=document.getElementById('forumTopics')||document.body;new MutationObserver(function(){requestAnimationFrame(decorate)}).observe(root,{childList:true,subtree:true});[100,300,700,1200,2000,3500].forEach(function(ms){setTimeout(decorate,ms)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();window.refreshForumClassIcons=decorate;
})();
