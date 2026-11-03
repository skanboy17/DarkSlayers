(function(){'use strict';
if(window.__dsRpgTransitionFix)return;window.__dsRpgTransitionFix=true;
const style=document.createElement('style');style.id='ds-rpg-transition-fix-css';style.textContent='.ds-rpg-loading{min-height:420px;display:grid;place-items:center;border:1px solid #2f1c1e;background:#080707;color:#756568;font:700 10px Arial;letter-spacing:1.2px}.ds-rpg-loading span{opacity:.75}';document.head.appendChild(style);
document.addEventListener('click',function(e){const b=e.target.closest('[data-game-tab="dungeon"]');if(!b||b.classList.contains('locked'))return;const v=document.getElementById('dsGameView');if(!v)return;const fromInventory=!!v.querySelector('.ds-loadouts,.ds-equip-grid,.ds-items,.ds-market-view');if(!fromInventory)return;v.innerHTML='<div class="ds-rpg-loading"><span>LOADING DUNGEON...</span></div>';
},true);
})();