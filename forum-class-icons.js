/* DARKSLAYERS - FORUM CLASS ICONS - ROBUST */
(function(){
'use strict';
const icons={
 warrior:'images/warrior.png',paladin:'images/paladin.png','death knight':'images/death-knight.png',druid:'images/druid.png',hunter:'images/hunter.png',rogue:'images/rogue.png',priest:'images/priest.png',shaman:'images/shaman.png',mage:'images/mage.png',warlock:'images/warlock.png',skyborn:'images/skyborn.png'
};
function norm(v){return String(v||'').trim().toLowerCase();}
function installCss(){
 if(document.getElementById('ds-forum-class-icons-css-v2'))return;
 const st=document.createElement('style');
 st.id='ds-forum-class-icons-css-v2';
 st.textContent=`
 .forum-topic-main small.ds-forum-meta-with-class{display:flex!important;align-items:center!important;min-height:30px!important}
 .ds-forum-class-avatar{display:inline-block!important;flex:0 0 28px!important;width:28px!important;height:28px!important;margin-right:8px!important;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;border:1px solid #7b2929!important;box-shadow:0 0 7px rgba(210,25,35,.32)!important;border-radius:2px!important}
 .ds-forum-meta-text{display:inline!important}
 `;
 document.head.appendChild(st);
}
function decorate(){
 installCss();
 document.querySelectorAll('.forum-topic-main small').forEach(function(el){
   const raw=(el.textContent||'').replace(/\s+/g,' ').trim();
   const parts=raw.split('•').map(x=>x.trim());
   if(parts.length<4)return;
   const cls=norm(parts[2]);
   const src=icons[cls];
   if(!src)return;
   const current=el.querySelector('.ds-forum-class-avatar');
   if(current && current.dataset.cls===cls)return;
   el.innerHTML='';
   el.classList.add('ds-forum-meta-with-class');
   const avatar=document.createElement('span');
   avatar.className='ds-forum-class-avatar';
   avatar.dataset.cls=cls;
   avatar.title=parts[2];
   avatar.style.backgroundImage='url("'+new URL(src,document.baseURI).href+'")';
   const text=document.createElement('span');
   text.className='ds-forum-meta-text';
   text.textContent=raw;
   el.appendChild(avatar);
   el.appendChild(text);
 });
}
function start(){
 installCss();decorate();
 const box=document.getElementById('forumTopics');
 if(box)new MutationObserver(function(){setTimeout(decorate,20)}).observe(box,{childList:true,subtree:true});
 let n=0;const poll=setInterval(function(){decorate();if(++n>=20)clearInterval(poll)},500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
window.refreshForumClassIcons=decorate;
})();
