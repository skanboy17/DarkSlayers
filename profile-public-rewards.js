/* DARKSLAYERS - PUBLIC MEMBER PROFILE REWARDS - PERFORMANCE FIX */
(function(){
'use strict';
var shopCache=null,shopCacheAt=0,lastPaintToken=0;
function db(){try{return typeof darkslayersSupabase!=='undefined'&&darkslayersSupabase?darkslayersSupabase:null}catch(e){return null}}
function norm(v){return String(v||'').trim().toLowerCase()}
function color(slug){slug=norm(slug);if(slug.includes('shadow')||slug.includes('dark'))return'#a83cff';if(slug.includes('frost'))return'#59d8ff';if(slug.includes('venom'))return'#79e71c';if(slug.includes('champion')||slug.includes('legendary'))return'#ffe000';if(slug.includes('void'))return'#dc36ff';if(slug.includes('flame')||slug.includes('dragon'))return'#ff3a20';return'#d52a34'}
function titleKind(x){var s=norm((x&&x.slug)+' '+(x&&x.name));if(s.includes('champion'))return'champion';if(s.includes('unstoppable'))return'unstoppable';if(s.includes('darkslayer')||s.includes('dark slayer')||s.includes('guild slayer'))return'darkslayer';if(s.includes('boss slayer'))return'boss';if(s.includes('legendary'))return'legendary';return'default'}
function css(){if(document.getElementById('ds-public-profile-rw-css'))return;var s=document.createElement('style');s.id='ds-public-profile-rw-css';s.textContent=`
#dsMemberProfileV2 .ds-wow-avatar{position:relative!important;overflow:visible!important;isolation:isolate!important}
#dsMemberProfileV2 .ds-wow-avatar>img{position:relative!important;z-index:3!important}
#dsMemberProfileV2 .ds-wow-avatar.ds-public-rw-frame:after{content:"";position:absolute;inset:-8px;border:4px solid var(--prw,#e22);border-radius:8px;box-shadow:0 0 12px var(--prw),0 0 25px color-mix(in srgb,var(--prw) 55%,transparent),inset 0 0 8px var(--prw);z-index:7;pointer-events:none}
#dsMemberProfileV2 .ds-public-rw-ring{position:absolute;inset:-13px;border:2px dashed var(--prw,#e22);border-radius:10px;z-index:6;pointer-events:none;animation:dsPublicRwSpin 7s linear infinite;will-change:transform}
#dsMemberProfileV2 .ds-wow-avatar.ds-public-rw-effect{box-shadow:0 0 14px var(--pfx,#ffe000),0 0 28px color-mix(in srgb,var(--pfx,#ffe000) 70%,transparent)!important}
#dsMemberProfileV2 .ds-public-rw-aura{position:absolute;inset:-5px;border:3px solid var(--pfx,#ffe000);border-radius:8px;z-index:5;pointer-events:none;box-shadow:0 0 16px var(--pfx,#ffe000);animation:dsPublicAuraRing 1.55s ease-in-out infinite!important;will-change:transform,opacity}
#dsMemberProfileV2 .ds-public-rw-title{display:inline-flex;margin-top:8px;padding:5px 12px;border:1px solid var(--tc,#b38b28);background:#160f04;color:#ffeaa0;font:900 11px Georgia,serif;text-shadow:0 0 7px var(--tc,#b38b28)}
#dsMemberProfileV2 .ds-public-rw-badge{display:inline-flex;margin:8px 0 0 7px;padding:4px 8px;border:1px solid #76252b;background:#150809;color:#f1c85c;font:900 9px Arial}
@keyframes dsPublicRwSpin{to{transform:rotate(360deg)}}
@keyframes dsPublicAuraRing{0%,100%{opacity:.5;transform:scale(.94)}50%{opacity:1;transform:scale(1.12)}}`;
document.head.appendChild(s)}
async function getShop(c){var now=Date.now();if(shopCache&&now-shopCacheAt<300000)return shopCache;var q=await c.from('reward_shop_items').select('id,slug,name,category,rarity');if(q.error)throw q.error;shopCache=q.data||[];shopCacheAt=now;return shopCache}
async function paint(){css();var root=document.querySelector('#dsMemberProfileV2 .ds-wow');if(!root)return;var name=root.querySelector('.ds-wow-name');if(!name)return;var c=db();if(!c)return;var n=(name.textContent||'').trim();if(!n)return;var token=++lastPaintToken;try{
 var q=await c.from('characters').select('user_id').ilike('character_name',n).limit(1);var uid=q.data&&q.data[0]&&q.data[0].user_id;
 if(!uid){var m=await c.from('members').select('user_id').ilike('name',n).limit(1);uid=m.data&&m.data[0]&&m.data[0].user_id}
 if(!uid||token!==lastPaintToken)return;
 if(root.dataset.publicRewardsUser===uid&&root.dataset.publicRewardsDone==='1')return;
 var all=await Promise.all([c.from('user_equipped_rewards').select('frame_item_id,title_item_id,badge_item_id,effect_item_id').eq('user_id',uid).maybeSingle(),getShop(c)]);
 if(token!==lastPaintToken||!document.body.contains(root))return;if(all[0].error){console.error('[PublicProfileRewards]',all[0].error);return}
 var eq=all[0].data||{},map={};(all[1]||[]).forEach(function(x){map[String(x.id)]=x});var frame=map[String(eq.frame_item_id||'')],effect=map[String(eq.effect_item_id||'')],title=map[String(eq.title_item_id||'')],badge=map[String(eq.badge_item_id||'')];
 var av=root.querySelector('.ds-wow-avatar');if(av){av.classList.remove('ds-rw-frame','ds-rw-effect','ds-public-rw-frame','ds-public-rw-effect');av.style.removeProperty('--rw');av.style.removeProperty('--fx');av.style.removeProperty('--prw');av.style.removeProperty('--pfx');av.querySelectorAll('.ds-rw-aura,.ds-rw-frame-ring,.ds-public-rw-aura,.ds-public-rw-ring').forEach(function(x){x.remove()});if(frame){av.classList.add('ds-public-rw-frame');av.style.setProperty('--prw',color(frame.slug));var ring=document.createElement('i');ring.className='ds-public-rw-ring';av.appendChild(ring)}if(effect){av.classList.add('ds-public-rw-effect');av.style.setProperty('--pfx',color(effect.slug));var aura=document.createElement('i');aura.className='ds-public-rw-aura';av.prepend(aura)}}
 root.querySelectorAll('.ds-wow-reward-title,.ds-wow-reward-badge,.ds-public-rw-title,.ds-public-rw-badge').forEach(function(x){x.remove()});var info=name.parentElement;if(info&&title){var t=document.createElement('div');t.className='ds-public-rw-title';t.style.setProperty('--tc',color(title.slug));t.dataset.kind=titleKind(title);t.textContent=title.name;info.appendChild(t)}if(info&&badge){var b=document.createElement('div');b.className='ds-public-rw-badge';b.textContent='◆ '+badge.name;info.appendChild(b)}
 root.dataset.publicRewardsUser=uid;root.dataset.publicRewardsDone='1';
 }catch(e){console.error('[PublicProfileRewards]',e)}}
function schedule(){requestAnimationFrame(function(){setTimeout(paint,20)})}
function install(){css();var old=window.openDarkSlayersMemberProfileV2;if(typeof old==='function'&&!old.__publicRewardsWrapped){var wrapped=function(){var r=old.apply(this,arguments);schedule();return r};wrapped.__publicRewardsWrapped=true;window.openDarkSlayersMemberProfileV2=wrapped}var mo=new MutationObserver(function(muts){for(var i=0;i<muts.length;i++){for(var j=0;j<muts[i].addedNodes.length;j++){var node=muts[i].addedNodes[j];if(node&&node.nodeType===1&&(node.id==='dsMemberProfileV2'||(node.querySelector&&node.querySelector('#dsMemberProfileV2')))){schedule();return}}}});mo.observe(document.body,{childList:true,subtree:false})}
window.refreshPublicProfileRewards=paint;if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(install,0)});else setTimeout(install,0);
})();