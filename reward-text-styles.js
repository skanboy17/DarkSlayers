/* DARKSLAYERS - REWARD SHOP TEXT STYLES CATEGORY */
(function(){
'use strict';
const styles={
  'blood-text':{label:'Blood Text',cls:'blood'},
  'shadow-text':{label:'Shadow Text',cls:'shadow'},
  'frost-text':{label:'Frost Text',cls:'frost'},
  'legendary-text':{label:'Legendary Text',cls:'legendary'}
};
function css(){if(document.getElementById('ds-text-shop-css'))return;const s=document.createElement('style');s.id='ds-text-shop-css';s.textContent=`
.ds-text-preview{width:190px;max-width:94%;min-height:54px;margin:7px auto;display:flex;align-items:center;justify-content:center;padding:8px;border:1px solid #351316;background:#070505;font:900 15px Georgia,serif;letter-spacing:.5px}.ds-text-preview.small{width:58px;min-height:38px;margin:0;padding:3px;font-size:8px;text-align:center}.ds-text-blood{color:#ff5555;text-shadow:0 0 7px rgba(255,45,45,.75)}.ds-text-shadow{color:#c17aff;text-shadow:0 0 8px rgba(166,72,255,.8)}.ds-text-frost{color:#72e5ff;text-shadow:0 0 8px rgba(72,210,255,.75)}.ds-text-legendary{color:#ffe06b;text-shadow:0 0 8px rgba(255,199,42,.85)}
`;document.head.appendChild(s)}
function preview(slug,small){const x=styles[slug];if(!x)return null;const d=document.createElement('div');d.className='ds-text-preview ds-text-'+x.cls+(small?' small':'');d.textContent=x.label;return d}
function decorate(){document.querySelectorAll('[data-reward-category="text"]').forEach(row=>{const slug=row.dataset.rewardSlug||'';let x=styles[slug];if(!x){const name=(row.querySelector('.ds-shop-name,.ds-inv-info b')||{}).textContent||'';const key=Object.keys(styles).find(k=>styles[k].label===name);if(key)x=styles[key],row.dataset.rewardSlug=key}if(!x||row.querySelector('.ds-text-preview'))return;const old=row.querySelector('.ds-shop-icon,.ds-inv-icon');const p=preview(row.dataset.rewardSlug,row.classList.contains('ds-inv-item'));if(p&&old)old.replaceWith(p)})}
function showText(){const all=document.querySelector('#dsRewardArea .ds-shop-tab[data-filter="all"]');if(all)all.click();const tabs=document.querySelector('#dsRewardArea .ds-shop-tabs');if(tabs)tabs.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x.dataset.filter==='text'));setTimeout(()=>{document.querySelectorAll('[data-shop-grid] .ds-shop-card').forEach(c=>c.style.display=c.dataset.rewardCategory==='text'?'':'none');decorate()},0)}
function add(){css();const tabs=document.querySelector('#dsRewardArea .ds-shop-tabs');if(!tabs)return false;let b=tabs.querySelector('[data-filter="text"]');if(!b){const badges=tabs.querySelector('[data-filter="badge"]');if(!badges)return false;b=document.createElement('button');b.type='button';b.className='ds-shop-tab';b.dataset.filter='text';b.textContent='✎ Text Styles';b.onclick=showText;badges.insertAdjacentElement('afterend',b)}tabs.style.gridTemplateColumns='repeat(6,1fr)';decorate();return true}
function start(){add();let n=0;const t=setInterval(()=>{n++;add();decorate();if(n>40)clearInterval(t)},250);const root=document.body;if(root)new MutationObserver(()=>decorate()).observe(root,{childList:true,subtree:true})}
window.refreshRewardTextStyles=function(){add();decorate()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();