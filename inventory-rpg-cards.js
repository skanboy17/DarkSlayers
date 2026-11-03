(function(){
'use strict';
function addStyles(){if(document.getElementById('ds-rpg-card-style'))return;const s=document.createElement('style');s.id='ds-rpg-card-style';s.textContent=`
/* RPG inventory cards: medium cards, vertical scroll only */
.ds-inventory-list,.ds-inventory-grid,.ds-inv-list,.ds-inv-grid{overflow-x:hidden!important;overflow-y:auto!important;max-height:330px!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;align-content:start!important;padding-right:7px!important;scrollbar-width:thin;scrollbar-color:#772029 #111}
.ds-inventory-list::-webkit-scrollbar,.ds-inventory-grid::-webkit-scrollbar,.ds-inv-list::-webkit-scrollbar,.ds-inv-grid::-webkit-scrollbar{width:8px;height:0}.ds-inventory-list::-webkit-scrollbar-thumb,.ds-inventory-grid::-webkit-scrollbar-thumb,.ds-inv-list::-webkit-scrollbar-thumb,.ds-inv-grid::-webkit-scrollbar-thumb{background:#772029;border-radius:8px}.ds-inventory-list::-webkit-scrollbar-track,.ds-inventory-grid::-webkit-scrollbar-track,.ds-inv-list::-webkit-scrollbar-track,.ds-inv-grid::-webkit-scrollbar-track{background:#0b0b0b}
.ds-item-card,.ds-inv-item{min-width:0!important;width:auto!important;max-width:none!important;height:94px!important;box-sizing:border-box!important;display:grid!important;grid-template-columns:66px minmax(0,1fr)!important;grid-template-rows:auto 1fr!important;column-gap:11px!important;padding:9px!important;overflow:hidden!important;background:linear-gradient(135deg,#101010,#070707)!important}
.ds-item-card .ds-compact-icon,.ds-inv-item .ds-compact-icon{grid-row:1/3;width:62px!important;height:62px!important;align-self:center!important;font-size:0!important;position:relative;background:radial-gradient(circle at 50% 40%,#291216,#070707 72%)!important;border:1px solid currentColor!important;box-shadow:inset 0 0 15px rgba(0,0,0,.8)}
.ds-compact-icon:after{display:grid;place-items:center;width:100%;height:100%;font-size:35px;line-height:1;color:#e7e0d5;text-shadow:0 2px 5px #000;content:'◆'}
.ds-item-card[data-item-type="main_hand"] .ds-compact-icon:after,.ds-inv-item[data-item-type="main_hand"] .ds-compact-icon:after{content:'⚔'}
.ds-item-card[data-item-type="off_hand"] .ds-compact-icon:after,.ds-inv-item[data-item-type="off_hand"] .ds-compact-icon:after{content:'◈'}
.ds-item-card[data-item-type="ring"] .ds-compact-icon:after,.ds-inv-item[data-item-type="ring"] .ds-compact-icon:after{content:'◉'}
.ds-item-card[data-item-type="trinket"] .ds-compact-icon:after,.ds-inv-item[data-item-type="trinket"] .ds-compact-icon:after{content:'✦'}
.ds-item-card[data-item-type="head"] .ds-compact-icon:after,.ds-inv-item[data-item-type="head"] .ds-compact-icon:after{content:'♜'}
.ds-item-card[data-item-type="chest"] .ds-compact-icon:after,.ds-inv-item[data-item-type="chest"] .ds-compact-icon:after{content:'♛'}
.ds-item-card[data-item-type="boots"] .ds-compact-icon:after,.ds-inv-item[data-item-type="boots"] .ds-compact-icon:after{content:'♟'}
.ds-item-card[data-item-type="hands"] .ds-compact-icon:after,.ds-inv-item[data-item-type="hands"] .ds-compact-icon:after{content:'✊'}
.ds-item-card[data-item-type="shoulders"] .ds-compact-icon:after,.ds-inv-item[data-item-type="shoulders"] .ds-compact-icon:after{content:'◆'}
.ds-item-card[data-item-type="belt"] .ds-compact-icon:after,.ds-inv-item[data-item-type="belt"] .ds-compact-icon:after{content:'▰'}
.ds-item-card[data-item-type="legs"] .ds-compact-icon:after,.ds-inv-item[data-item-type="legs"] .ds-compact-icon:after{content:'▾'}
.ds-item-card strong,.ds-inv-item strong{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:13px!important;line-height:17px!important}.ds-item-card small,.ds-inv-item small{font-size:10px!important;line-height:14px!important}.ds-item-card .ds-item-stats,.ds-inv-item .ds-item-stats{display:none!important}.ds-item-card em,.ds-inv-item em{font-size:10px!important;line-height:13px!important;color:#d65b61!important;align-self:end!important}
@media(max-width:720px){.ds-inventory-list,.ds-inventory-grid,.ds-inv-list,.ds-inv-grid{grid-template-columns:1fr!important}.ds-item-card,.ds-inv-item{height:90px!important}}
`;
document.head.appendChild(s)}
function classify(){document.querySelectorAll('.ds-item-card,.ds-inv-item').forEach(card=>{let txt=(card.textContent||'').toLowerCase(),type='';[['main_hand',['main hand','main_hand','sword','dagger','bow']],['off_hand',['off hand','off_hand']],['ring',['ring']],['trinket',['trinket','emblem']],['head',['head','helm']],['chest',['chest']],['boots',['boots']],['hands',['hands','gloves']],['shoulders',['shoulders']],['belt',['belt']],['legs',['legs']]].some(([t,words])=>words.some(w=>txt.includes(w))?(type=t,true):false);if(type)card.dataset.itemType=type})}
function run(){addStyles();classify()}
run();new MutationObserver(()=>classify()).observe(document.body,{subtree:true,childList:true});
})();