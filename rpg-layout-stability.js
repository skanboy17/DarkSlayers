(function(){'use strict';
if(window.__dsRpgLayoutStability)return;window.__dsRpgLayoutStability=true;
let panel=null,maxHeight=0,ro=null,mo=null,timer=null;
function findPanel(){return document.querySelector('main.dashboard section.panel.news.ds-character-panel')||document.querySelector('main.dashboard section.panel.news')}
function lock(){let p=findPanel();if(!p)return;if(panel!==p){panel=p;maxHeight=Math.ceil(p.getBoundingClientRect().height||0);p.style.overflowAnchor='none';if(ro)ro.disconnect();ro=new ResizeObserver(function(entries){let h=Math.ceil(entries[0]?.contentRect?.height||0);if(h>maxHeight+2){maxHeight=h;panel.style.minHeight=maxHeight+'px'}else if(maxHeight>0&&h<maxHeight-2){panel.style.minHeight=maxHeight+'px'}});ro.observe(p)}let h=Math.ceil(p.getBoundingClientRect().height||0);if(h>maxHeight)maxHeight=h;if(maxHeight>0)p.style.minHeight=maxHeight+'px';let boss=document.getElementById('dsGuildBoss');if(boss)boss.style.overflowAnchor='none'}
function schedule(){clearTimeout(timer);timer=setTimeout(lock,20)}
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#dsGameView button,.ds-char-tab,.ds-char-action'))schedule()},true);
mo=new MutationObserver(schedule);mo.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('resize',function(){maxHeight=0;if(panel)panel.style.removeProperty('min-height');schedule()});
setTimeout(lock,100);setTimeout(lock,700);
})();