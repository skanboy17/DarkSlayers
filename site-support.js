/* DARKSLAYERS - SITE SUPPORT + UI FIXES */
(function(){
'use strict';
const PAYPAL='https://paypal.me/DarkSlayers';
function install(){
 if(document.getElementById('ds-site-support'))return;
 const style=document.createElement('style');
 style.textContent=`#ds-site-support{position:relative;z-index:5;width:220px;height:68px;box-sizing:border-box;margin:0 12px;padding:8px 10px;border:1px solid #a51e27;border-radius:4px;background:linear-gradient(180deg,rgba(92,8,14,.94),rgba(36,4,7,.96));box-shadow:inset 0 1px 0 rgba(255,105,105,.12),0 0 10px rgba(190,18,27,.24),0 5px 16px rgba(0,0,0,.4);color:#eee;font-family:inherit;cursor:pointer;transition:.22s ease;overflow:hidden;display:grid;grid-template-columns:36px minmax(0,1fr);grid-template-areas:'heart copy' 'heart paypal';align-items:center;column-gap:9px;row-gap:3px}#ds-site-support:hover{transform:translateY(-2px);border-color:#ef3a43;box-shadow:0 0 18px rgba(220,28,38,.48),0 8px 22px rgba(0,0,0,.5)}.ds-support-heart{grid-area:heart;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:1px solid #ff4754;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff6671 0,#d91d2d 38%,#7e0913 70%,#250306 100%);color:#fff;font-size:18px;box-shadow:0 0 13px rgba(255,38,52,.62)}.ds-support-copy{grid-area:copy;min-width:0}.ds-support-title{font-family:Georgia,serif;font-weight:900;color:#f5d17b;font-size:11px;text-transform:uppercase;white-space:nowrap}.ds-support-sub{font-size:8px;color:#d0b7b7;margin-top:2px;white-space:nowrap}.ds-support-paypal{grid-area:paypal;justify-self:start;padding:4px 7px;border:1px solid rgba(76,157,255,.6);border-radius:3px;background:linear-gradient(180deg,#102b4d,#08172a);font-size:9px;font-weight:800;color:#fff}.ds-support-paypal b{color:#78baff}.ds-hero-join,.ds-hero-discord{border:1px solid #a51e27!important;background:linear-gradient(180deg,rgba(92,8,14,.94),rgba(36,4,7,.96))!important;box-shadow:inset 0 1px 0 rgba(255,105,105,.12),0 0 10px rgba(190,18,27,.2)!important;transition:.22s ease!important}.ds-hero-join:hover,.ds-hero-discord:hover{border-color:#ef3a43!important;transform:translateY(-2px)}#ds-support-overlay{position:fixed;inset:0;z-index:10050;background:rgba(0,0,0,.78);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;padding:18px;box-sizing:border-box}#ds-support-overlay.open{display:flex}.ds-support-modal{position:relative;width:min(500px,100%);padding:28px 26px 24px;box-sizing:border-box;text-align:center;border:1px solid #8f282d;border-radius:14px;background:radial-gradient(circle at top,#281010 0,#100909 48%,#070707 100%);box-shadow:0 0 30px rgba(217,39,46,.3),0 25px 80px rgba(0,0,0,.8);color:#ddd}.ds-support-close{position:absolute;right:12px;top:9px;border:0;background:transparent;color:#aaa;font-size:27px;cursor:pointer}.ds-support-modal h2{margin:13px 0 12px;color:#f1d08a;font-size:22px}.ds-support-modal p{margin:8px auto;max-width:420px;line-height:1.55;font-size:14px;color:#c9c3c3}.ds-support-btn{display:inline-block;margin-top:13px;padding:12px 22px;border:1px solid #c52e34;border-radius:7px;background:linear-gradient(#b92028,#74151b);color:white!important;text-decoration:none!important;font-weight:800}.ds-support-thanks{color:#d7b76e!important;font-weight:700}@media(max-width:850px){#ds-site-support{width:200px;margin:8px auto}}`;
 document.head.appendChild(style);
 const box=document.createElement('div');box.id='ds-site-support';box.setAttribute('role','button');box.setAttribute('tabindex','0');box.innerHTML='<span class="ds-support-heart">❤</span><div class="ds-support-copy"><div class="ds-support-title">SUSTINE SITE-UL</div><div class="ds-support-sub">Ajuta la domeniu si intretinere.</div></div><div class="ds-support-paypal"><b>PayPal</b> · Sustine →</div>';
 const overlay=document.createElement('div');overlay.id='ds-support-overlay';overlay.innerHTML='<div class="ds-support-modal" role="dialog" aria-modal="true"><button class="ds-support-close" aria-label="Inchide">×</button><h2>Sustine site-ul DARKSLAYERS</h2><p>Daca iti place site-ul si vrei sa ajuti la mentinerea si dezvoltarea lui, poti contribui cu orice suma doresti.</p><p>Contributiile sunt folosite pentru <strong>domeniu, servicii si intretinerea site-ului</strong>.</p><a class="ds-support-btn" href="'+PAYPAL+'" target="_blank" rel="noopener noreferrer">PayPal — Sustine site-ul</a><p class="ds-support-thanks">⚔ Multumim ca faci parte din DARKSLAYERS!</p></div>';
 function findHeroButtons(){const els=[...document.querySelectorAll('a,button')];return{join:els.find(el=>/ALATURA-TE GUILDEI/i.test(el.textContent||'')),discord:els.find(el=>/INTRA PE DISCORD/i.test(el.textContent||''))}}
 function place(){const {join,discord}=findHeroButtons();if(join&&discord){join.classList.add('ds-hero-join');discord.classList.add('ds-hero-discord');const parent=join.parentElement;if(parent===discord.parentElement){parent.insertBefore(box,discord);return}}if(!box.isConnected)document.body.appendChild(box)}
 function open(){overlay.classList.add('open');document.body.style.overflow='hidden'}function close(){overlay.classList.remove('open');document.body.style.overflow=''}box.addEventListener('click',open);box.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});overlay.querySelector('.ds-support-close').addEventListener('click',close);overlay.addEventListener('click',e=>{if(e.target===overlay)close()});document.body.appendChild(overlay);place();setTimeout(place,300);setTimeout(place,1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();

/* Modal hierarchy: account -> admin/officer -> moderation. */
(function(){
 if(typeof window.closeSiteModal!=='function')return;
 const originalClose=window.closeSiteModal;
 let busy=false;
 window.closeSiteModal=function(){
  if(busy)return;
  const title=(document.getElementById('siteModalTitle')?.textContent||'').trim().toUpperCase();
  if(title==='MODERARE AVATARE'){
   busy=true;
   Promise.resolve().then(async()=>{
    try{
     const user=await getDarkSlayersUser();
     const profile=user?await getDarkSlayersProfile(user):null;
     const role=String(profile?.role||'').toLowerCase();
     if(role==='admin'&&typeof openAdminPanel==='function')await openAdminPanel();
     else if(role==='officer'&&typeof openOfficerPanel==='function')await openOfficerPanel();
     else originalClose();
    }finally{busy=false}
   });
   return;
  }
  if(title==='ADMIN PANEL'||title==='OFFICER PANEL'){
   busy=true;
   try{
    if(typeof openAccountModal==='function')openAccountModal('login');
    else originalClose();
   }finally{busy=false}
   return;
  }
  originalClose();
 };
})();
