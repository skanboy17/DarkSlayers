(function(){'use strict';
if(window.__dsPvpDefeatedLabelOnly)return;window.__dsPvpDefeatedLabelOnly=true;
function clean(){
 document.querySelectorAll('#dsGameView .ds-pvp-attack').forEach(btn=>{
  const t=(btn.textContent||'').trim().toUpperCase();
  if(t.startsWith('DEFEATED')){btn.textContent='DEFEATED';btn.title='Opponent is defeated';}
 });
}
new MutationObserver(clean).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
setInterval(clean,250);setTimeout(clean,0);
})();