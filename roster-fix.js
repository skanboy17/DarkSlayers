/* DARKSLAYERS ROSTER - FINAL UI */
(function(){
'use strict';

const CLASS_ICONS={
"Warrior":"images/warrior.png","Paladin":"images/paladin.png","Death Knight":"images/death-knight.png",
"Druid":"images/druid.png","Hunter":"images/hunter.png","Rogue":"images/rogue.png","Priest":"images/priest.png",
"Shaman":"images/shaman.png","Mage":"images/mage.png","Warlock":"images/warlock.png","Skyborn":"images/skyborn.png"
};
const RANKS={
gm:{label:"GUILD MASTER",icon:"images/roster/guild-master.svg",order:0},
officer:{label:"OFFICER",icon:"images/roster/officer.svg",order:1},
veteran:{label:"VETERAN",icon:"images/roster/veteran.svg",order:2},
core:{label:"CORE RAIDER",icon:"images/roster/core-raider.svg",order:3},
member:{label:"MEMBER",icon:"images/roster/member.svg",order:4}
};
const ROLE_ICONS={tank:"images/roster/tank.svg",healer:"images/roster/healer.svg",melee:"images/roster/melee.svg",ranged:"images/roster/ranged.svg"};

function db(){try{return typeof darkslayersSupabase!=="undefined"?darkslayersSupabase:null}catch(e){return null}}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function roleKind(c,s,r){
 r=String(r||"").toUpperCase(); c=String(c||""); s=String(s||"");
 if(r==="TANK")return"tank"; if(r==="HEALER")return"healer";
 return ["Hunter","Mage","Warlock"].includes(c)||(c==="Priest"&&s==="Shadow")||(c==="Druid"&&s==="Balance")||(c==="Shaman"&&s==="Elemental")?"ranged":"melee";
}
function roleLabel(k){return {tank:"TANK",healer:"HEALER",melee:"MELEE DPS",ranged:"RANGED DPS"}[k]}
function rankInfo(v,pr){
 pr=String(pr||"").toLowerCase();
 if(pr==="admin")return {...RANKS.gm,key:"gm"};
 if(pr==="officer")return {...RANKS.officer,key:"officer"};
 v=String(v||"member").toLowerCase();
 if(v==="gm"||v==="guild master")return {...RANKS.gm,key:"gm"};
 if(v==="officer")return {...RANKS.officer,key:"officer"};
 if(v==="veteran")return {...RANKS.veteran,key:"veteran"};
 if(v==="core"||v==="core raider")return {...RANKS.core,key:"core"};
 return {...RANKS.member,key:"member"};
}

async function prepare(input){
 let rows=(Array.isArray(input)?input:[]).map(x=>({...x}));
 const c=db(); if(!c)return rows;
 const ids=[...new Set(rows.map(x=>x.user_id).filter(Boolean))];
 let ps=[],cs=[];
 if(ids.length){
  try{
   const [p,ch]=await Promise.all([
    c.from("profiles").select("id,display_name,role").in("id",ids),
    c.from("characters").select("user_id,character_name,class,spec,combat_role,game,level,is_main").in("user_id",ids)
   ]);
   ps=p.data||[]; cs=ch.data||[];
  }catch(e){console.warn(e)}
 }
 const pm={}; ps.forEach(p=>pm[p.id]=p);
 const cm={}; cs.forEach(x=>{if(x.is_main===true)cm[x.user_id]=x});
 rows.forEach(m=>{
  if(!m.user_id)return;
  const p=pm[m.user_id],ch=cm[m.user_id]; m._profileRole=p?.role||"";
  if(ch){
   m.name=ch.character_name||(p&&p.display_name)||m.name;m.class=ch.class||m.class;m.spec=ch.spec||"";
   m.role=ch.combat_role||m.role;m.game=ch.game||m.game;m.level=ch.level||m.level;
  }else if(p?.display_name)m.name=p.display_name;
 });
 const unique=new Map();
 rows.forEach(m=>{
  const k=String(m.name||"").trim().toLowerCase(); if(!k)return;
  const old=unique.get(k);
  if(!old||(!old.user_id&&m.user_id))unique.set(k,m);
 });
 rows=[...unique.values()];
 rows.sort((a,b)=>{
  const ra=rankInfo(a.rank,a._profileRole),rb=rankInfo(b.rank,b._profileRole);
  return ra.order-rb.order||String(a.name||"").localeCompare(String(b.name||""));
 });
 return rows;
}

function render(rows){
 const list=document.querySelector(".roster-list"); if(!list)return;
 list.innerHTML=rows.map(m=>{
  const rk=rankInfo(m.rank,m._profileRole),kind=roleKind(m.class,m.spec,m.role);
  const clsIcon=CLASS_ICONS[m.class]||ROLE_ICONS[kind];
  const details=[m.class||"Clasa",m.spec||"",m.game||"",m.level?("Lv. "+Number(m.level)):""].filter(Boolean).join(" • ");
  return `<div class="roster-member ds-rank-${rk.key}" data-rank="${rk.key}">
   <div class="roster-avatar ds-class-box"><img src="${clsIcon}" alt="${esc(m.class||"Class")}"></div>
   <div class="roster-player"><h3>${esc(m.name||"Member")}${m.user_id?' <small class="roster-linked-badge">CONT</small>':""}</h3>
   <span>${esc(details)} <b class="ds-combat ${kind}"><img src="${ROLE_ICONS[kind]}" alt="">${roleLabel(kind)}</b></span></div>
   <div class="roster-rank ds-rank-box ${rk.key}"><img src="${rk.icon}" alt=""><strong>${rk.label}</strong></div>
   <div class="roster-status online">• ACTIVE</div>
  </div>`;
 }).join("");
}

function css(){
 if(document.getElementById("ds-roster-final-css"))return;
 const s=document.createElement("style");s.id="ds-roster-final-css";s.textContent=`
 .roster-list{display:flex!important;flex-direction:column!important;gap:10px!important}
 .roster-member{order:10;min-height:92px!important;border:1px solid #342020!important;border-left:5px solid #ff343b!important;background:linear-gradient(90deg,#090707,#070707)!important}
 .roster-member.ds-rank-gm{order:0;border:2px solid #ffd21c!important;border-left:7px solid #ffd21c!important;box-shadow:0 0 18px rgba(255,210,28,.23)!important}
 .roster-member.ds-rank-officer{order:1;border-left-color:#ff343b!important}
 .roster-member.ds-rank-veteran{order:2;border-left-color:#b96cff!important}
 .roster-member.ds-rank-core{order:3;border-left-color:#ff7b2f!important}
 .roster-member.ds-rank-member{order:4;border-left-color:#777!important}
 .ds-class-box{overflow:hidden!important;padding:0!important;border:1px solid #a52b2b!important;background:#050505!important}
 .ds-class-box img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}
 .ds-rank-box{display:flex!important;align-items:center!important;justify-content:center!important;gap:12px!important;min-height:46px!important;border:1px solid currentColor!important;background:#080808!important}
 .ds-rank-box img{width:31px!important;height:31px!important;object-fit:contain!important}
 .ds-rank-box.gm{color:#ffd21c!important;box-shadow:0 0 13px rgba(255,210,28,.25)!important}
 .ds-rank-box.officer{color:#ff343b!important}.ds-rank-box.veteran{color:#b96cff!important}
 .ds-rank-box.core{color:#ff7b2f!important}.ds-rank-box.member{color:#b8c0c8!important}
 .ds-rank-box strong{font-size:13px;letter-spacing:1.2px}
 .ds-combat{display:inline-flex!important;align-items:center!important;gap:5px!important;margin-left:8px!important;font-size:12px!important}
 .ds-combat img{width:18px!important;height:18px!important;object-fit:contain!important}
 .ds-combat.tank{color:#248cff!important}.ds-combat.healer{color:#25d968!important}
 .ds-combat.melee{color:#ff3c3c!important}.ds-combat.ranged{color:#ff9d2d!important}
 .roster-linked-badge{font-size:8px;color:#25d968;border:1px solid #16833d;padding:2px 5px;border-radius:4px;margin-left:7px}
 .roster-status.online{color:#25d968!important;font-weight:900!important}
 @media(max-width:800px){.ds-rank-box img{display:none!important}.ds-rank-box strong{font-size:10px}.roster-member{min-height:80px!important}}
 `;document.head.appendChild(s);
}

async function finalRender(rows){render(await prepare(rows))}
function install(){
 css();
 window.renderDarkSlayersRoster=function(rows){window.DARKSLAYERS_MEMBERS=Array.isArray(rows)?rows:[];finalRender(window.DARKSLAYERS_MEMBERS)};
 document.addEventListener("darkslayers:members-loaded",e=>finalRender(e.detail||[]));
 if(Array.isArray(window.DARKSLAYERS_MEMBERS))finalRender(window.DARKSLAYERS_MEMBERS);
}
install();
})();