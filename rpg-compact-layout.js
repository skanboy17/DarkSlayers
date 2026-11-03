(function(){'use strict';if(document.getElementById('ds-rpg-compact-layout'))return;const s=document.createElement('style');s.id='ds-rpg-compact-layout';s.textContent=`
/* Dungeon selector: compact single-column rows */
.ds-dungeon-cards{display:flex!important;flex-direction:column!important;gap:7px!important;margin-top:12px!important}
.ds-dungeon-card,.ds-dungeon-card:first-child{grid-column:auto!important;min-height:0!important;padding:10px 12px!important;display:grid!important;grid-template-columns:34px minmax(0,1fr) auto!important;grid-template-rows:auto auto!important;column-gap:10px!important;row-gap:2px!important;align-items:center!important}
.ds-dungeon-card-icon{grid-column:1!important;grid-row:1/3!important;font-size:20px!important;margin:0!important;text-align:center!important}
.ds-dungeon-card h3,.ds-dungeon-card:first-child h3{grid-column:2!important;grid-row:1!important;font-size:15px!important;margin:0!important;line-height:1.1!important}
.ds-dungeon-card-meta{grid-column:2!important;grid-row:2!important;font-size:8px!important;margin:1px 0 0!important}
.ds-dungeon-card>p{display:none!important}
.ds-dungeon-card-bottom{grid-column:3!important;grid-row:1/3!important;margin:0!important;padding:0!important;align-self:center!important}
.ds-dungeon-card .ds-dungeon-btn{padding:8px 11px!important;font-size:8px!important;white-space:nowrap!important}
.ds-dungeon-lock{padding:7px 9px!important;font-size:8px!important;white-space:nowrap!important}
.ds-dungeon-select-head{padding:8px 5px 3px!important}.ds-dungeon-select-head h2{font-size:21px!important}.ds-dungeon-hp{margin:8px auto 2px!important}
/* Inventory: fixed-height scrolling area, but every card keeps enough height for its icon/text */
.ds-items,.ds-inventory-items,.ds-inventory-grid{gap:8px!important}
.ds-items{height:330px!important;min-height:330px!important;max-height:330px!important;align-content:start!important;grid-auto-rows:minmax(76px,auto)!important}
.ds-item{height:auto!important;min-height:76px!important;padding:8px!important;grid-template-columns:58px minmax(0,1fr)!important;gap:10px!important;align-self:start!important;box-sizing:border-box!important}
.ds-item h4{font-size:13px!important;line-height:1.12!important;margin:0 0 5px!important;max-height:30px!important;overflow:hidden!important}
.ds-item p,.ds-item-meta,.ds-item-stats{font-size:8px!important;line-height:1.25!important;margin:2px 0!important}
.ds-item img,.ds-item-icon{width:58px!important;height:58px!important;min-width:58px!important;min-height:58px!important}
.ds-item-mini{min-height:58px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;min-width:0!important}
.ds-item-mini-action{align-self:flex-start!important;margin-top:2px!important}
.ds-item button,.ds-equip-btn,.ds-unequip-btn{padding:6px 9px!important;font-size:8px!important}
@media(max-width:700px){.ds-dungeon-card,.ds-dungeon-card:first-child{grid-template-columns:28px minmax(0,1fr)!important}.ds-dungeon-card-bottom{grid-column:2!important;grid-row:3!important;justify-self:start!important;margin-top:5px!important}.ds-dungeon-card-icon{grid-row:1/4!important}.ds-items{height:330px!important;min-height:330px!important;grid-auto-rows:minmax(76px,auto)!important}.ds-item{min-height:76px!important}}
`;document.head.appendChild(s)})();