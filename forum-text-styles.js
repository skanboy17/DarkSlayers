/* DARKSLAYERS - FORUM TEXT STYLES - equipped text by forum author */
(function(){
'use strict';
const allowed={'blood-text':'ds-forum-text-blood','shadow-text':'ds-forum-text-shadow','frost-text':'ds-forum-text-frost','legendary-text':'ds-forum-text-legendary'};
let busy=false,pending=false,timer=0;
function db(){try{return typeof darkslayersSupabase!=='undefined'&&darkslayersSupabase?darkslayersSupabase:null}catch(e){return null}}
function css(){if(document.getElementById('ds-forum-text-css'))return;const s=document.createElement('style');s.id='ds-forum-text-css';s.textContent=`.forum-original>p.ds-forum-styled-text,.forum-reply>p.ds-forum-styled-text{font-weight:600!important}.forum-original>p.ds-forum-text-blood,.forum-reply>p.ds-forum-text-blood{color:#ff5a5a!important;text-shadow:0 0 6px rgba(255,48,48,.48)!important}.forum-original>p.ds-forum-text-shadow,.forum-reply>p.ds-forum-text-shadow{color:#c586ff!important;text-shadow:0 0 7px rgba(158,70,255,.55)!important}.forum-original>p.ds-forum-text-frost,.forum-reply>p.ds-forum-text-frost{color:#78e6ff!important;text-shadow:0 0 7px rgba(66,206,255,.5)!important}.forum-original>p.ds-forum-text-legendary,.forum-reply>p.ds-forum-text-legendary{color:#ffe477!important;text-shadow:0 0 7px rgba(255,194,35,.58)!important}`;document.head.appendChild(s)}
function posts(){return [...document.querySelectorAll('.forum-original,.forum-reply')]}
function author(post){return post.querySelector('.ds-forum-author[data-user-id]')||post.querySelector('.ds-forum-author')}
function uid(post){const a=author(post);return String((a&&a.dataset&&a.dataset.userId)||post.dataset.userId||post.dataset.authorId||'').trim()}
function message(post){return post.querySelector(':scope > p')||post.querySelector('.forum-post-content')||post.querySelector('.forum-message')}
function apply(post,slug){const p=message(post);if(!p)return;p.classList.remove('ds-forum-styled-text',...Object.values(allowed));if(slug&&allowed[slug])p.classList.add('ds-forum-styled-text',allowed[slug])}
async function refresh(){css();if(busy){pending=true;return}busy=true;try{const list=posts();if(!list.length)return;const ids=[...new Set(list.map(uid).filter(Boolean))];if(!ids.length)return;const sb=db();if(!sb)return;const eq=await sb.from('user_equipped_rewards').select('user_id,text_item_id').in('user_id',ids);if(eq.error)throw eq.error;const itemIds=[...new Set((eq.data||[]).map(x=>x.text_item_id).filter(Boolean))];const byItem=new Map();if(itemIds.length){const shop=await sb.from('reward_shop_items').select('id,slug,category').in('id',itemIds);if(shop.error)throw shop.error;(shop.data||[]).forEach(x=>{const slug=String(x.slug||'').toLowerCase();if(String(x.category||'').toLowerCase()==='text'&&allowed[slug])byItem.set(String(x.id),slug)})}const byUser=new Map();(eq.data||[]).forEach(x=>byUser.set(String(x.user_id),byItem.get(String(x.text_item_id))||''));list.forEach(post=>{const a=author(post),slug=byUser.get(uid(post))||'';if(a){if(slug)a.dataset.textStyle=slug;else delete a.dataset.textStyle}apply(post,slug)})}catch(e){console.error('[ForumTextStyles]',e)}finally{busy=false;if(pending){pending=false;setTimeout(refresh,0)}}}
function schedule(delay){clearTimeout(timer);timer=setTimeout(refresh,delay==null?80:delay)}
window.refreshForumTextStyles=refresh;
window.addEventListener('darkslayers:rewards-changed',()=>schedule(40));
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('.ds-equip-btn'))schedule(650)});
const root=document.body;if(root)new MutationObserver(m=>{if(m.some(x=>x.addedNodes&&x.addedNodes.length))schedule(100)}).observe(root,{childList:true,subtree:true});
css();schedule(0);
})();