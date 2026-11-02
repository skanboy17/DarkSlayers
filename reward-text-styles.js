/* DARKSLAYERS - REWARD SHOP TEXT STYLES CATEGORY */
(function(){
'use strict';
function add(){
  var tabs=document.querySelector('#dsRewardArea .ds-shop-tabs');
  if(!tabs||tabs.querySelector('[data-filter="text"]'))return false;
  var badges=tabs.querySelector('[data-filter="badge"]');
  if(!badges)return false;
  var b=document.createElement('button');
  b.className='ds-shop-tab';
  b.dataset.filter='text';
  b.textContent='✎ Text Styles';
  b.onclick=function(){
    tabs.querySelectorAll('[data-filter]').forEach(function(x){x.classList.toggle('active',x===b)});
    var grid=document.querySelector('[data-shop-grid]');
    if(grid)grid.innerHTML='<div class="ds-inv-empty ds-text-style-coming" style="grid-column:1/-1"><strong>TEXT STYLES</strong>Blood Text • 300 Tokens<br>Shadow Text • 400 Tokens<br>Frost Text • 500 Tokens<br>Legendary Text • 750 Tokens</div>';
  };
  badges.insertAdjacentElement('afterend',b);
  tabs.style.gridTemplateColumns='repeat(6,1fr)';
  return true;
}
function start(){if(add())return;var n=0,t=setInterval(function(){n++;if(add()||n>40)clearInterval(t)},250)}
window.refreshRewardTextStyles=add;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();