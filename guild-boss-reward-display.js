/* DARKSLAYERS - Guild Boss reward header (display only; wallet untouched) */
(function(){
'use strict';
if(window.__dsBossRewardHeaderV1)return;window.__dsBossRewardHeaderV1=true;
var REWARDS={1:50,2:100,3:150,4:200,5:250,6:300,7:350,8:400,9:450,10:500};
function refresh(){
  var box=document.querySelector('#dsGuildBoss .ds-boss-token');
  var num=document.querySelector('#dsGuildBoss [data-boss-number]');
  if(!box||!num)return;
  var n=parseInt((num.textContent||'').trim(),10);
  var reward=REWARDS[n];
  if(!reward)return;
  box.innerHTML='🪙 BOSS REWARD: <b data-boss-current-reward>'+reward.toLocaleString('en-US')+' TOKENS</b>';
  box.title='Recompensa de baza pentru bossul curent. Bonusul de clasament se adauga separat.';
}
function schedule(){setTimeout(refresh,0);setTimeout(refresh,300);setTimeout(refresh,1000)}
document.addEventListener('click',function(e){if(e.target.closest?.('[data-ds-arcade-nav],a[href="#dsGuildBoss"],.ds-boss-attack'))schedule()},true);
document.addEventListener('DOMContentLoaded',schedule);
window.addEventListener('load',schedule);
setInterval(refresh,5000);
schedule();
})();