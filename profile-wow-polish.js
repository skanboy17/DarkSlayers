/* DARKSLAYERS - PROFILE V2 WOW VISUAL POLISH */
(function(){
'use strict';
function addStyle(){
 if(document.getElementById('ds-wow-polish-css')) return;
 var s=document.createElement('style');
 s.id='ds-wow-polish-css';
 s.textContent=`
 #dsMemberProfileV2 .ds-wow{border-color:#5d3420!important;box-shadow:0 0 0 1px #140805,0 0 0 4px rgba(76,34,18,.35),0 18px 55px rgba(0,0,0,.75)!important;background:linear-gradient(145deg,#120b08,#050505 58%)!important}
 #dsMemberProfileV2 .ds-wow-top{background:radial-gradient(circle at 70% 0,#32100b,#0b0705 64%)!important;border-bottom-color:#6b3420!important}
 #dsMemberProfileV2 .ds-wow-avatar{border-color:#9a5728!important;box-shadow:inset 0 0 0 2px #1d0b05,0 0 16px rgba(190,102,35,.25)!important}
 #dsMemberProfileV2 .ds-wow-tabs{background:#090604!important;border-bottom-color:#5a2b1b!important}
 #dsMemberProfileV2 .ds-wow-tab{border-color:#4a291c!important;background:linear-gradient(#1b100b,#0b0705)!important;color:#8e8279!important}
 #dsMemberProfileV2 .ds-wow-tab.active{color:#f5e7cf!important;border-color:#9b5b2c!important;background:linear-gradient(#4b2414,#1b0d08)!important;box-shadow:inset 0 2px 0 rgba(255,188,90,.16)!important}
 #dsMemberProfileV2 .ds-wow-card{border-color:#4b2a1c!important;background:#080706!important}
 #dsMemberProfileV2 .ds-wow-title{border-bottom-color:#4b2a1c!important;background:linear-gradient(90deg,#1b0e09,#0c0806)!important;color:#e2d2bd!important}
 #dsMemberProfileV2 .ds-wow-char{transition:border-color .15s,background .15s!important;cursor:default}
 #dsMemberProfileV2 .ds-wow-char.main{border-color:#347b3f!important;box-shadow:inset 3px 0 0 #3d9b4e!important}
 #dsMemberProfileV2 .ds-wow-main{background:#0c2c14!important;border:1px solid #2b7d3b!important;padding:3px 5px!important}
 #dsMemberProfileV2 .ds-wow-role{display:inline-flex!important;align-items:center!important;gap:5px!important}
 #dsMemberProfileV2 .ds-wow-role:before{font-size:13px!important}
 #dsMemberProfileV2 .ds-role-tank{color:#4ca8ff!important;border-color:#27659a!important;background:#071725!important}.ds-role-tank:before{content:'🛡'!important}
 #dsMemberProfileV2 .ds-role-healer{color:#58df72!important;border-color:#287b39!important;background:#071b0b!important}.ds-role-healer:before{content:'✚'!important}
 #dsMemberProfileV2 .ds-role-melee{color:#ff5a5f!important;border-color:#8d292d!important;background:#21090b!important}.ds-role-melee:before{content:'⚔'!important}
 #dsMemberProfileV2 .ds-role-ranged{color:#f3ad4d!important;border-color:#946121!important;background:#211507!important}.ds-role-ranged:before{content:'➶'!important}
 #dsMemberProfileV2 .ds-wow-hof{position:relative!important;border:1px solid #c3912c!important;background:linear-gradient(110deg,#2b1c05,#0c0905 70%)!important;box-shadow:inset 0 0 22px rgba(255,191,45,.06),0 0 14px rgba(218,160,32,.12)!important;padding-left:48px!important}
 #dsMemberProfileV2 .ds-wow-hof:before{content:'🏆';position:absolute;left:14px;top:13px;font-size:24px}
 #dsMemberProfileV2 .ds-wow-hof b{color:#ffd76c!important;text-shadow:0 0 8px rgba(255,190,40,.22)!important}
 #dsMemberProfileV2 .ds-wow-badge.ds-hof-polish{border-color:#b88625!important;background:linear-gradient(#2a1b05,#100b05)!important;color:#ffd76c!important}
 #dsMemberProfileV2 .ds-wow-ci{border-color:#7b4a27!important;box-shadow:inset 0 0 0 1px #160a05!important}
 `;
 document.head.appendChild(s);
}
function roleClass(text){
 var t=String(text||'').toLowerCase();
 if(t.indexOf('tank')>=0)return'ds-role-tank';
 if(t.indexOf('healer')>=0)return'ds-role-healer';
 if(t.indexOf('ranged')>=0)return'ds-role-ranged';
 return'ds-role-melee';
}
function polish(root){
 if(!root)return;
 root.querySelectorAll('.ds-wow-tag').forEach(function(el){
   var t=(el.textContent||'').trim();
   if(/tank|healer|ranged dps|melee dps/i.test(t)){el.classList.add('ds-wow-role',roleClass(t));}
 });
 root.querySelectorAll('.ds-wow-row').forEach(function(r){
   var label=r.querySelector('span'),val=r.querySelector('b');
   if(label&&val&&String(label.textContent).trim().toLowerCase()==='rol'){
     val.classList.add('ds-wow-role',roleClass(val.textContent));
   }
 });
 root.querySelectorAll('.ds-wow-badge').forEach(function(b){if(/hall of fame/i.test(b.textContent||''))b.classList.add('ds-hof-polish');});
}
addStyle();
var obs=new MutationObserver(function(){var r=document.getElementById('dsMemberProfileV2');if(r)polish(r)});
obs.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(function(){polish(document.getElementById('dsMemberProfileV2'))},500);
})();
