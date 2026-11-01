/* DARKSLAYERS - HALL OF FAME ROSTER HIGHLIGHT */
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
`;document.head.appendChild(s)
}
async function apply(){
 addCss();var c=db();if(!c)return;
 var r=await c.from('hall_of_fame').select('member_name,title');
 if(r.error){console.error('Hall roster highlight:',r.error);return}
 var hall={};(r.data||[]).forEach(function(x){if(norm(x.member_name))hall[norm(x.member_name)]=x.title||'HALL OF FAME'});
 document.querySelectorAll('.roster-member').forEach(function(card){
   card.classList.remove('ds-hof-member');
   card.querySelectorAll('.ds-hof-badge,.ds-hof-crown').forEach(function(x){x.remove()});
   var h=card.querySelector('.roster-player h3');if(!h)return;
   var clone=h.cloneNode(true);clone.querySelectorAll('small,.ds-hof-badge').forEach(function(x){x.remove()});
   var name=norm(clone.textContent);if(!hall[name])return;
   card.classList.add('ds-hof-member');
   var badge=document.createElement('span');badge.className='ds-hof-badge';badge.title=hall[name];badge.textContent='🏆 HALL OF FAME';h.appendChild(badge);
   var crown=document.createElement('div');crown.className='ds-hof-crown';crown.textContent='🏆';card.appendChild(crown);
 });
}
window.refreshHallRosterHighlight=apply;
document.addEventListener('darkslayers:members-loaded',function(){setTimeout(apply,400)});
document.addEventListener('darkslayers:hall-updated',function(){setTimeout(apply,100)});
setTimeout(apply,900);setTimeout(apply,2200);
})();
