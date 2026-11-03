/* DARKSLAYERS - live Guild Boss reward display, no wallet changes */
(function(){
'use strict';
if(window.__dsBossRewardHeaderV2)return;
window.__dsBossRewardHeaderV2=true;
var currentName='', currentBase=null, pending=false;
function client(){try{return typeof darkslayersSupabase!=='undefined'?darkslayersSupabase:null}catch(e){return null}}
function fmt(n){return Number(n).toLocaleString('en-US')}
function paint(){
 var root=document.getElementById('dsGuildBoss');if(!root||currentBase===null)return;
 var header=root.querySelector('.ds-boss-token');
 if(header){
  var label='🪙 BOSS REWARD: '+fmt(currentBase)+' TOKENS';
  if(header.dataset.rewardLabel!==label){header.dataset.rewardLabel=label;header.textContent='🪙 BOSS REWARD: ';var b=document.createElement('b');b.setAttribute('data-boss-current-reward','');b.textContent=fmt(currentBase)+' TOKENS';header.appendChild(b)}
  header.title='Recompensa de baza a bossului activ; bonusurile de clasament se adauga separat.';
 }
 var base=root.querySelector('[data-base-reward]');if(base)base.textContent=fmt(currentBase);
 var list=root.querySelectorAll('.ds-boss-reward-list .ds-boss-reward');
 [100,75,50,20].forEach(function(bonus,i){
  var item=list[i];if(!item)return;
  var b=item.querySelector('b');if(b)b.textContent=['🥇 ','🥈 ','🥉 ','⚔ '][i]+fmt(currentBase+bonus)+' TOKENS';
  var s=item.querySelector('span');if(s)s.textContent=['Locul 1 ('+fmt(currentBase)+' + 100)','Locul 2 ('+fmt(currentBase)+' + 75)','Locul 3 ('+fmt(currentBase)+' + 50)','Participant ('+fmt(currentBase)+' + 20)'][i];
 });
}
async function sync(){
 if(pending||!document.getElementById('dsGuildBoss'))return;
 var sb=client();if(!sb)return;
 pending=true;
 try{
  var active=await sb.from('guild_boss').select('name').eq('status','active').order('id',{ascending:false}).limit(1).maybeSingle();
  if(active.error||!active.data)return;
  var name=active.data.name;
  if(name!==currentName||currentBase===null){
   var q=await sb.from('guild_boss_rotation').select('reward_tokens').eq('name',name).limit(1).maybeSingle();
   if(q.error||!q.data||!Number.isFinite(Number(q.data.reward_tokens)))return;
   currentName=name;currentBase=Number(q.data.reward_tokens);
   if(typeof window.refreshGuildBoss==='function')window.refreshGuildBoss();
  }
  paint();
 }catch(e){console.warn('Guild Boss reward refresh:',e)}
 finally{pending=false}
}
document.addEventListener('click',function(e){if(e.target.closest?.('[data-ds-arcade-nav],a[href="#dsGuildBoss"],.ds-boss-attack'))setTimeout(sync,1100)},true);
document.addEventListener('visibilitychange',function(){if(!document.hidden)sync()});
window.addEventListener('load',sync);
setInterval(function(){if(!document.hidden)sync()},15000);
setInterval(paint,2500);
sync();
})();
