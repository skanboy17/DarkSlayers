(function(){'use strict';
if(window.__dsDungeonEntryGate)return;window.__dsDungeonEntryGate=true;
let busy=false;
async function enter(){if(busy)return;busy=true;try{document.querySelectorAll('.ds-char-tab').forEach(x=>x.classList.toggle('active',x.dataset.gameTab==='dungeon'));if(typeof window.openCharacterDungeon==='function'&&window.currentCharacterGame)await window.openCharacterDungeon(window.currentCharacterGame)}catch(err){console.error('Dungeon entry:',err)}finally{busy=false}}
document.addEventListener('click',function(e){let b=e.target.closest('[data-game-tab="dungeon"]');if(!b||b.classList.contains('locked'))return;e.preventDefault();e.stopImmediatePropagation();enter()},true);
})();