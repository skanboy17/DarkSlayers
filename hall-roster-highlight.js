/* DARKSLAYERS - HALL OF FAME + MEMBER OF THE MONTH ROSTER HIGHLIGHT - PERFORMANCE */
(function(){
'use strict';
function db(){try{return typeof darkslayersSupabase!=='undefined'?darkslayersSupabase:null}catch(e){return null}}
function norm(v){return String(v||'').trim().toLowerCase()}
function addCss(){
 if(document.getElementById('ds-hof-roster-css'))return;
 var s=document.createElement('style');s.id='ds-hof-roster-css';
 s.textContent=`
.roster-member.ds-hof-member{position:relative!important;border:2px solid #dffaff!important;border-left:7px solid #38e8ff!important;background:linear-gradient(100deg,#071216,#080909 42%,#061115)!important;box-shadow:0 0 13px rgba(56,232,255,.50),inset 0 0 22px rgba(230,252,255,.06)!important}
.roster-member.ds-hof-member:before{content:"";position:absolute;inset:-3px;pointer-events:none;border:1px solid rgba(220,250,255,.48);box-shadow:0 0 19px rgba(56,232,255,.22)}
.ds-hof-badge{display:inline-flex!important;align-items:center!important;margin-left:8px!important;padding:3px 7px!important;border:1px solid #8fefff!important;border-radius:4px!important;color:#f1fdff!important;background:#06161a!important;font-size:9px!important;font-weight:900!important;letter-spacing:.7px!important;text-shadow:0 0 8px rgba(56,232,255,.8)!important;box-shadow:inset 0 0 8px rgba(56,232,255,.10)!important}
.ds-hof-crown{position:absolute;right:12px;top:10px;z-index:5;width:25px;height:25px;display:flex;align-items:center;justify-content:center;border:1px solid #baf6ff;border-radius:50%;background:#061216;box-shadow:0 0 9px rgba(56,232,255,.58);font-size:13px;line-height:1}
.roster-member.ds-hof-member .roster-player h3{color:#f4feff!important;text-shadow:0 0 9px rgba(56,232,255,.72)!important}
.roster-member.ds-month-member{border:2px solid #22d3ee!important;border-left:7px solid #22d3ee!important;background:linear-gradient(100deg,#03171b,#080909 45%,#041418)!important;box-shadow:0 0 20px rgba(34,211,238,.55),inset 0 0 25px rgba(34,211,238,.08)!important}
.roster-member.ds-month-member:before{border-color:rgba(103,232,249,.58)!important;box-shadow:0 0 22px rgba(34,211,238,.30)!important}
.roster-member.ds-month-member .ds-hof-badge{border-color:#22d3ee!important;color:#a5f3fc!important;background:#03171b!important;text-shadow:0 0 9px rgba(34,211,238,.95)!important;box-shadow:0 0 10px rgba(34,211,238,.22),inset 0 0 8px rgba(34,211,238,.12)!important}
.roster-member.ds-month-member .ds-hof-crown{border-color:#22d3ee!important;background:#03171b!important;box-shadow:0 0 13px rgba(34,211,238,.78)!important}
.roster-member.ds-month-member .roster-player h3{color:#dffcff!important;text-shadow:0 0 10px rgba(34,211,238,.78)!important}
`;document.head.appendChild(s)
}
function cleanName(h){if(!h)return'';var clone=h.cloneNode(true);clone.querySelectorAll('small,.ds-hof-badge').forEach(function(x){x.remove()});return norm(clone.textContent)}
var awardCache=null,awardCacheAt=0,running=false,timer=0;
async function getAwards(force){
 if(!force&&awardCache&&Date.now()-awardCacheAt<300000)return awardCache;
 var c=db(),hall={};
 if(c){try{var r=await c.from('hall_of_fame').select('member_name,title,created_at').order('created_at',{ascending:false});if(r.error)throw r.error;(r.data||[]).forEach(function(x){var n=norm(x.member_name);if(n&&!hall[n])hall[n]={title:x.title||'HALL OF FAME',label:'🏆 HALL OF FAME',month:false}})}catch(e){console.error('Hall roster highlight:',e)}}
 hall['ipouncealot']={title:'DARKSLAYER OF THE MONTH',label:'🏆 MEMBRUL LUNII',month:true};awardCache=hall;awardCacheAt=Date.now();return hall
}
async function apply(force){
 if(running)return;running=true;
 try{addCss();var hall=await getAwards(force);document.querySelectorAll('.roster-member').forEach(function(card){card.classList.remove('ds-hof-member','ds-month-member');card.querySelectorAll('.ds-hof-badge,.ds-hof-crown').forEach(function(x){x.remove()});var h=card.querySelector('.roster-player h3');if(!h)return;var name=cleanName(h),award=hall[name];if(!award)return;card.classList.add('ds-hof-member');if(award.month)card.classList.add('ds-month-member');var badge=document.createElement('span');badge.className='ds-hof-badge';badge.title=award.title;badge.textContent=award.label;h.appendChild(badge);var crown=document.createElement('div');crown.className='ds-hof-crown';crown.textContent='🏆';card.appendChild(crown)})}finally{running=false}
}
function schedule(force){clearTimeout(timer);timer=setTimeout(function(){apply(force)},120)}
window.refreshHallRosterHighlight=function(){schedule(false)};
document.addEventListener('darkslayers:members-loaded',function(){schedule(false)});
document.addEventListener('darkslayers:hall-updated',function(){awardCache=null;schedule(true)});
setTimeout(function(){schedule(false)},650);
var roster=document.querySelector('.roster-list');if(roster){new MutationObserver(function(muts){var external=muts.some(function(m){return Array.from(m.addedNodes||[]).some(function(n){return n.nodeType===1&&!n.classList.contains('ds-hof-badge')&&!n.classList.contains('ds-hof-crown')})});if(external)schedule(false)}).observe(roster,{childList:true});}
})();
