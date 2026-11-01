/* DARKSLAYERS - HALL OF FAME ROSTER HIGHLIGHT */
(function(){
'use strict';
function db(){try{return typeof darkslayersSupabase!=='undefined'?darkslayersSupabase:null}catch(e){return null}}
function norm(v){return String(v||'').trim().toLowerCase()}
function addCss(){
 if(document.getElementById('ds-hof-roster-css'))return;
 var s=document.createElement('style');s.id='ds-hof-roster-css';
 s.textContent=`
.roster-member.ds-hof-member{position:relative!important;border:2px solid #8b5cf6!important;border-left:7px solid #a970ff!important;background:linear-gradient(100deg,#11091c,#080707 40%,#100817)!important;box-shadow:0 0 12px rgba(139,92,246,.55),inset 0 0 24px rgba(169,112,255,.08)!important}
.roster-member.ds-hof-member:before{content:"";position:absolute;inset:-3px;pointer-events:none;border:1px solid rgba(190,150,255,.30);box-shadow:0 0 20px rgba(139,92,246,.22)}
.ds-hof-badge{display:inline-flex!important;align-items:center!important;margin-left:8px!important;padding:3px 7px!important;border:1px solid #9b6cff!important;border-radius:4px!important;color:#c9a7ff!important;background:#130b20!important;font-size:9px!important;font-weight:900!important;letter-spacing:.7px!important;text-shadow:0 0 8px rgba(169,112,255,.55)!important}
.ds-hof-crown{position:absolute;right:12px;top:10px;z-index:5;width:25px;height:25px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(155,108,255,.95);border-radius:50%;background:#0d0715;box-shadow:0 0 8px rgba(139,92,246,.5);font-size:13px;line-height:1}
.roster-member.ds-hof-member .roster-player h3{color:#c9a7ff!important;text-shadow:0 0 10px rgba(169,112,255,.4)!important}
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
