/* DARKSLAYERS ROSTER - ROBUST FINAL FIX */
(function(){
'use strict';

var CLASS_ICONS={
"Warrior":"images/warrior.png","Paladin":"images/paladin.png","Death Knight":"images/death-knight.png",
"Druid":"images/druid.png","Hunter":"images/hunter.png","Rogue":"images/rogue.png","Priest":"images/priest.png",
"Shaman":"images/shaman.png","Mage":"images/mage.png","Warlock":"images/warlock.png","Skyborn":"images/skyborn.png"
};
var ROLE_ICONS={tank:"images/roster/tank.svg",healer:"images/roster/healer.svg",melee:"images/roster/melee.svg",ranged:"images/roster/ranged.svg"};
var RANKS={
gm:{key:"gm",label:"GUILD MASTER",icon:"images/roster/guild-master.svg",order:0},
officer:{key:"officer",label:"OFFICER",icon:"images/roster/officer.svg",order:1},
veteran:{key:"veteran",label:"VETERAN",icon:"images/roster/veteran.svg",order:2},
core:{key:"core",label:"CORE RAIDER",icon:"images/roster/core-raider.svg",order:3},
member:{key:"member",label:"MEMBER",icon:"images/roster/member.svg",order:4}
};

function getDB(){try{if(typeof darkslayersSupabase!=="undefined"&&darkslayersSupabase)return darkslayersSupabase;}catch(e){} return null;}
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c];});}
function rankInfo(v,profileRole){
 var p=String(profileRole||"").toLowerCase(),r=String(v||"member").toLowerCase();
 if(p==="admin")return RANKS.gm;
 if(p==="officer")return RANKS.officer;
 if(r==="gm"||r==="guild master")return RANKS.gm;
 if(r==="officer")return RANKS.officer;
 if(r==="veteran")return RANKS.veteran;
 if(r==="core"||r==="core raider")return RANKS.core;
 return RANKS.member;
}
function roleKind(c,s,r){
 r=String(r||"").toUpperCase(); c=String(c||""); s=String(s||"");
 if(r==="TANK")return"tank"; if(r==="HEALER")return"healer";
 if(["Hunter","Mage","Warlock"].indexOf(c)>=0||(c==="Priest"&&s==="Shadow")||(c==="Druid"&&s==="Balance")||(c==="Shaman"&&s==="Elemental"))return"ranged";
 return"melee";
}
function roleLabel(k){return {tank:"TANK",healer:"HEALER",melee:"MELEE DPS",ranged:"RANGED DPS"}[k]||"DPS";}

async function loadRealRoster(){
 var db=getDB(); if(!db)return null;
 try{
   var mres=await db.from("members").select("id,created_at,name,game,class,role,rank,level,user_id");
   if(mres.error)throw mres.error;
   var rows=mres.data||[];
   var ids=[];
   rows.forEach(function(m){if(m.user_id&&ids.indexOf(m.user_id)<0)ids.push(m.user_id);});
   var profiles=[],chars=[];
   if(ids.length){
     var pr=await db.from("profiles").select("id,display_name,role").in("id",ids);
     if(!pr.error)profiles=pr.data||[];
     var cr=await db.from("characters").select("user_id,character_name,class,spec,combat_role,game,level,is_main").in("user_id",ids);
     if(!cr.error)chars=cr.data||[];
   }
   var pm={},cm={};
   profiles.forEach(function(p){pm[p.id]=p;});
   chars.forEach(function(c){if(c.is_main===true)cm[c.user_id]=c;});
   rows.forEach(function(m){
     if(!m.user_id)return;
     var p=pm[m.user_id],c=cm[m.user_id];
     m._profileRole=p&&p.role?p.role:"";
     if(c){
       m.name=c.character_name||(p&&p.display_name)||m.name;
       m.class=c.class||m.class;m.spec=c.spec||"";m.role=c.combat_role||m.role;
       m.game=c.game||m.game;m.level=c.level||m.level;
     } else if(p&&p.display_name) m.name=p.display_name;
   });

   /* Remove old placeholder rows such as Officer/Veteran/Core Raider/Member
      when they are not linked to a real account. */
   rows=rows.filter(function(m){
     if(m.user_id)return true;
     var n=String(m.name||"").trim().toLowerCase();
     return ["officer","veteran","core raider","member"].indexOf(n)<0;
   });

   /* Remove duplicate character names, preferring linked account. */
   var map={};
   rows.forEach(function(m){
     var k=String(m.name||"").trim().toLowerCase();
     if(!k)return;
     if(!map[k]||(!map[k].user_id&&m.user_id))map[k]=m;
   });
   rows=Object.keys(map).map(function(k){return map[k];});
   rows.sort(function(a,b){
     var ra=rankInfo(a.rank,a._profileRole),rb=rankInfo(b.rank,b._profileRole);
     if(ra.order!==rb.order)return ra.order-rb.order;
     return String(a.name||"").localeCompare(String(b.name||""));
   });
   return rows;
 }catch(e){console.error("DARKSLAYERS roster:",e);return null;}
}

function render(rows){
 var list=document.querySelector(".roster-list"); if(!list||!rows)return;
 list.innerHTML=rows.map(function(m){
   var rk=rankInfo(m.rank,m._profileRole),kind=roleKind(m.class,m.spec,m.role);
   var classIcon=CLASS_ICONS[m.class]||ROLE_ICONS[kind];
   var d=[m.class||"Clasa",m.spec||"",m.game||"",m.level?("Lv. "+Number(m.level)):""].filter(Boolean).join(" • ");
   return '<div class="roster-member ds-rank-'+rk.key+'" data-rank="'+rk.key+'">'+
    '<div class="roster-avatar ds-class-box"><img src="'+classIcon+'" alt="'+esc(m.class||"Class")+'"></div>'+
    '<div class="roster-player"><h3>'+esc(m.name||"Member")+(m.user_id?' <small class="roster-linked-badge">CONT</small>':'')+'</h3>'+
    '<span>'+esc(d)+' <b class="ds-combat '+kind+'"><img src="'+ROLE_ICONS[kind]+'" alt="">'+roleLabel(kind)+'</b></span></div>'+
    '<div class="roster-rank ds-rank-box '+rk.key+'"><img src="'+rk.icon+'" alt=""><strong>'+rk.label+'</strong></div>'+
    '<div class="roster-status online">• ACTIVE</div></div>';
 }).join("");
}

function styles(){
 if(document.getElementById("ds-robust-roster-css"))return;
 var s=document.createElement("style");s.id="ds-robust-roster-css";
 s.textContent='.roster-list{display:flex!important;flex-direction:column!important;gap:10px!important}.roster-member{min-height:92px!important;border:1px solid #342020!important;border-left:5px solid #ff343b!important;background:#080707!important}.roster-member.ds-rank-gm{border:2px solid #ffd21c!important;border-left:7px solid #ffd21c!important;box-shadow:0 0 18px rgba(255,210,28,.23)!important}.roster-member.ds-rank-veteran{border-left-color:#b96cff!important}.roster-member.ds-rank-core{border-left-color:#ff7b2f!important}.roster-member.ds-rank-member{border-left-color:#777!important}.ds-class-box{overflow:hidden!important;padding:0!important;background:#050505!important}.ds-class-box img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}.ds-rank-box{display:flex!important;align-items:center!important;justify-content:center!important;gap:12px!important;min-height:46px!important;border:1px solid currentColor!important;background:#080808!important}.ds-rank-box img{width:31px!important;height:31px!important}.ds-rank-box.gm{color:#ffd21c!important}.ds-rank-box.officer{color:#ff343b!important}.ds-rank-box.veteran{color:#b96cff!important}.ds-rank-box.core{color:#ff7b2f!important}.ds-rank-box.member{color:#b8c0c8!important}.ds-combat{display:inline-flex!important;align-items:center!important;gap:5px!important;margin-left:8px!important;font-size:12px!important}.ds-combat img{width:18px!important;height:18px!important}.ds-combat.tank{color:#248cff!important}.ds-combat.healer{color:#25d968!important}.ds-combat.melee{color:#ff3c3c!important}.ds-combat.ranged{color:#ff9d2d!important}.roster-linked-badge{font-size:8px;color:#25d968;border:1px solid #16833d;padding:2px 5px;border-radius:4px;margin-left:7px}.roster-status.online{color:#25d968!important;font-weight:900!important}';
 document.head.appendChild(s);
}
async function refresh(){styles();var rows=await loadRealRoster();if(rows)render(rows);}
function install(){
 styles();
 /* Override old renderer even if script-base tries to render placeholders later. */
 window.renderDarkSlayersRoster=function(){refresh();};
 document.addEventListener("darkslayers:members-loaded",function(){setTimeout(refresh,20);});
 setTimeout(refresh,100);setTimeout(refresh,700);setTimeout(refresh,1800);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install);else install();
})();