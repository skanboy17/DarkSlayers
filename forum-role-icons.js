/* DARKSLAYERS - FORUM CLASS ICONS */
(function(){
'use strict';

var CLASS_ICONS={
 'warrior':'images/warrior.png',
 'paladin':'images/paladin.png',
 'death knight':'images/death-knight.png',
 'druid':'images/druid.png',
 'hunter':'images/hunter.png',
 'rogue':'images/rogue.png',
 'priest':'images/priest.png',
 'shaman':'images/shaman.png',
 'mage':'images/mage.png',
 'warlock':'images/warlock.png',
 'skyborn':'images/skyborn.png'
};
function norm(v){return String(v||'').trim().toLowerCase()}
function css(){
 if(document.getElementById('ds-forum-class-css'))return;
 var s=document.createElement('style');
 s.id='ds-forum-class-css';
 s.textContent='.ds-forum-class-icon{width:26px;height:26px;object-fit:cover;border:1px solid #6b2525;box-shadow:0 0 7px rgba(210,25,35,.28);vertical-align:middle;margin-right:7px;border-radius:2px}.forum-topic-main small{display:flex;align-items:center;flex-wrap:wrap;gap:0}';
 document.head.appendChild(s);
}
function apply(){
 css();
 document.querySelectorAll('.forum-topic-main small').forEach(function(el){
   if(el.querySelector('.ds-forum-class-icon'))return;
   var txt=(el.textContent||'').trim();
   var parts=txt.split('•').map(function(x){return x.trim()});
   if(parts.length<4)return;
   var cls=norm(parts[2]);
   var src=CLASS_ICONS[cls];
   if(!src)return;
   var img=document.createElement('img');
   img.className='ds-forum-class-icon';
   img.src=src;
   img.alt=parts[2]||'Class';
   img.title=parts[2]||'Class';
   el.insertBefore(img,el.firstChild);
 });
}
var timer=null;
function schedule(){clearTimeout(timer);timer=setTimeout(apply,40)}
function start(){
 css();
 var box=document.getElementById('forumTopics');
 if(box)new MutationObserver(schedule).observe(box,{childList:true,subtree:true});
 schedule();setTimeout(apply,200);setTimeout(apply,600);setTimeout(apply,1300);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
window.refreshForumRoleIcons=apply;
window.refreshForumClassIcons=apply;
})();