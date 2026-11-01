(function(){
"use strict";
const CLASS_ICONS={
"warrior":"images/warrior.png","paladin":"images/paladin.png","death knight":"images/death-knight.png",
"druid":"images/druid.png","hunter":"images/hunter.png","rogue":"images/rogue.png",
"priest":"images/priest.png","shaman":"images/shaman.png","mage":"images/mage.png",
"warlock":"images/warlock.png","skyborn":"images/skyborn.png"
};

function addCSS(){
 if(document.getElementById("ds-forum-class-css")) return;
 const s=document.createElement("style");
 s.id="ds-forum-class-css";
 s.textContent=`
 .forum-topic{display:grid!important;grid-template-columns:220px 64px minmax(0,1fr) 40px!important;align-items:center!important;gap:14px!important;min-height:86px!important}
 .forum-topic-category{grid-column:1!important;grid-row:1!important}
 .ds-forum-class-icon{grid-column:2!important;grid-row:1!important;width:48px!important;height:48px!important;display:flex!important;overflow:hidden!important;border:1px solid #8f292d!important;border-radius:5px!important;background:#070707!important;box-shadow:0 0 8px rgba(220,30,40,.35)!important}
 .ds-forum-class-icon img{width:100%!important;height:100%!important;display:block!important;object-fit:cover!important}
 .forum-topic-main{grid-column:3!important;grid-row:1!important;min-width:0!important;text-align:left!important}
 .forum-topic-main small{display:block!important;margin-top:5px!important;min-height:0!important}
 .forum-topic-arrow{grid-column:4!important;grid-row:1!important}
 @media(max-width:700px){.forum-topic{grid-template-columns:95px 44px minmax(0,1fr) 22px!important;gap:8px!important}.ds-forum-class-icon{width:38px!important;height:38px!important}}
 `;
 document.head.appendChild(s);
}

function detectClass(topic){
 const meta=topic.querySelector(".forum-topic-main small");
 if(!meta) return null;
 const text=(meta.textContent||"").replace(/\s+/g," ").trim().toLowerCase();
 for(const cls of Object.keys(CLASS_ICONS)){
   const esc=cls.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
   if(new RegExp("(^|•|\\s)"+esc+"(\\s|•|$)","i").test(text)) return cls;
 }
 return null;
}

function decorate(topic){
 const main=topic.querySelector(".forum-topic-main");
 if(!main) return;
 const cls=detectClass(topic);
 if(!cls) return;
 let box=topic.querySelector(".ds-forum-class-icon");
 if(box && box.dataset.className===cls) return;
 if(box) box.remove();
 box=document.createElement("span");
 box.className="ds-forum-class-icon";
 box.dataset.className=cls;
 const img=document.createElement("img");
 img.src=CLASS_ICONS[cls]+"?v=forum-class-final";
 img.alt=cls;
 img.title=cls.charAt(0).toUpperCase()+cls.slice(1);
 box.appendChild(img);
 topic.insertBefore(box,main);
}

function refresh(){
 addCSS();
 document.querySelectorAll(".forum-topic").forEach(decorate);
}

function start(){
 refresh();
 const root=document.getElementById("forumTopics")||document.body;
 new MutationObserver(()=>setTimeout(refresh,50)).observe(root,{childList:true,subtree:true});
 [250,700,1500,3000].forEach(ms=>setTimeout(refresh,ms));
}

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start);
else start();

window.refreshForumClassIcons=refresh;
})();