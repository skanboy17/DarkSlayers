/* DARKSLAYERS - forum category icons: equal glow, hover only */
(function(){
'use strict';
function install(){
  if(document.getElementById('ds-forum-icon-hover-css')) return;
  const s=document.createElement('style');
  s.id='ds-forum-icon-hover-css';
  s.textContent=`
#forum .ds-forum-cat-icon{
  border-color:#642127!important;
  background:radial-gradient(circle at 50% 42%,#25090d 0,#120607 62%,#070303 100%)!important;
  box-shadow:inset 0 0 10px rgba(0,0,0,.9)!important;
  transition:border-color .18s ease,background .18s ease,box-shadow .18s ease!important;
}
#forum .ds-forum-cat-icon svg{
  width:23px!important;
  height:23px!important;
  fill:none!important;
  stroke:#e2444c!important;
  stroke-width:1.7!important;
  filter:none!important;
  opacity:.92!important;
  transition:stroke .18s ease,filter .18s ease,opacity .18s ease!important;
}
#forum .ds-forum-cat-icon svg path,
#forum .ds-forum-cat-icon svg rect,
#forum .ds-forum-cat-icon svg circle,
#forum .ds-forum-cat-icon svg line,
#forum .ds-forum-cat-icon svg polyline,
#forum .ds-forum-cat-icon svg polygon{
  stroke:inherit!important;
  filter:none!important;
}
#forum .ds-forum-cat:hover .ds-forum-cat-icon{
  border-color:#d54a42!important;
  background:radial-gradient(circle at 50% 45%,rgba(238,164,64,.22) 0,rgba(139,28,25,.36) 43%,#100506 78%)!important;
  box-shadow:inset 0 0 10px rgba(125,20,20,.55),0 0 8px rgba(224,55,48,.72),0 0 14px rgba(229,166,69,.28)!important;
}
#forum .ds-forum-cat:hover .ds-forum-cat-icon svg{
  stroke:#f3b74f!important;
  opacity:1!important;
  filter:drop-shadow(0 0 2px rgba(255,205,105,.95)) drop-shadow(0 0 5px rgba(224,61,45,.78))!important;
}
`;
  document.head.appendChild(s);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true}); else install();
})();
