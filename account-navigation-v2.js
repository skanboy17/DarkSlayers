/* DARKSLAYERS - one authoritative account navigation flow */
(function(){
'use strict';

function cachedAccount(){
  try{const ui=JSON.parse(localStorage.getItem('darkslayers-account-ui')||'null');return ui&&ui.loggedIn?ui:null;}catch(e){return null;}
}
function cleanName(v){return String(v||'CONTUL MEU').replace(/^[♛⚔]\s*/, '').trim();}

const realOpenAdmin=typeof window.openAdminPanel==='function'?window.openAdminPanel:null;
const realOpenOfficer=typeof window.openOfficerPanel==='function'?window.openOfficerPanel:null;
let staffOpenAllowed=false;

async function openAdminAllowed(){
  if(!realOpenAdmin)return;
  staffOpenAllowed=true;
  document.getElementById('siteModal')?.classList.remove('ds-account-open');
  try{return await realOpenAdmin();}finally{staffOpenAllowed=false;}
}
async function openOfficerAllowed(){
  if(!realOpenOfficer)return;
  staffOpenAllowed=true;
  document.getElementById('siteModal')?.classList.remove('ds-account-open');
  try{return await realOpenOfficer();}finally{staffOpenAllowed=false;}
}

/* Hard guard: legacy code is not allowed to throw the user into staff panels. */
if(realOpenAdmin){
  window.openAdminPanel=function(){
    if(!staffOpenAllowed){openLoggedAccount();return;}
    return realOpenAdmin();
  };
}
if(realOpenOfficer){
  window.openOfficerPanel=function(){
    if(!staffOpenAllowed){openLoggedAccount();return;}
    return realOpenOfficer();
  };
}
window.openAdminPanelFromAccount=openAdminAllowed;
window.openOfficerPanelFromAccount=openOfficerAllowed;

function accountPanel(saved){
  const admin=!!saved?.admin;
  const label=cleanName(saved?.label);
  return `<div id="loggedInPanel" class="auth-logged" style="display:grid">
    <div class="account-profile-card">
      <span id="loggedInRole" class="role-badge ${admin?'role-admin':''}">${admin?'GUILD MASTER':'MEMBER'}</span>
      <strong id="loggedInName">${label}</strong>
      <small id="loggedInEmail"></small>
    </div>
    <button id="dsAccountEditProfile" class="auth-submit profile-panel-button" onclick="window.openDarkSlayersProfileEditorV2?.()">✎ EDITEAZA PROFILUL</button>
    <button class="auth-submit profile-panel-button" onclick="openMyProfile()">👤 PROFILUL MEU</button>
    <button id="adminPanelButton" class="auth-submit admin-panel-button" style="display:${admin?'block':'none'}" onclick="openAdminPanelFromAccount()">♛ ADMIN PANEL</button>
    <button id="officerPanelButton" class="auth-submit admin-panel-button" style="display:none" onclick="openOfficerPanelFromAccount()">⚔ OFFICER PANEL</button>
    <button class="auth-submit auth-logout" onclick="logoutDarkSlayers()">LOGOUT</button>
  </div>`;
}

function openLoggedAccount(savedOverride){
  if(!document.getElementById('ds-account-scroll-fix')){
    const style=document.createElement('style');
    style.id='ds-account-scroll-fix';
    style.textContent='#siteModal.ds-account-open{overflow-y:auto!important;align-items:safe center!important;overscroll-behavior:contain}#siteModal.ds-account-open #siteModalContent{min-height:0}#siteModal.ds-account-open .auth-logged{gap:12px}';
    document.head.appendChild(style);
  }
  document.getElementById('siteModal')?.classList.add('ds-account-open');
  const modalBox=document.querySelector('#siteModal .site-modal-box');
  if(modalBox){modalBox.style.maxHeight='calc(100dvh - 24px)';modalBox.style.overflowY='auto';}
  const saved=savedOverride||cachedAccount();
  if(!saved)return false;
  openSiteModal({icon:'♛',label:'DARKSLAYERS',title:'CONT',content:accountPanel(saved)});
  (async()=>{
    try{
      if(typeof getDarkSlayersUser!=='function'||typeof getDarkSlayersProfile!=='function')return;
      const user=await getDarkSlayersUser(); if(!user)return;
      const profile=await getDarkSlayersProfile(user);
      if(!document.getElementById('loggedInPanel'))return;
      const role=String(profile?.role||'member').toLowerCase();
      const roleEl=document.getElementById('loggedInRole');
      const nameEl=document.getElementById('loggedInName');
      const mailEl=document.getElementById('loggedInEmail');
      const adminBtn=document.getElementById('adminPanelButton');
      const officerBtn=document.getElementById('officerPanelButton');
      if(roleEl){roleEl.textContent=role==='admin'?'GUILD MASTER':role.toUpperCase();roleEl.classList.toggle('role-admin',role==='admin');}
      if(nameEl)nameEl.textContent=profile?.display_name||user.user_metadata?.display_name||cleanName(saved.label);
      if(mailEl)mailEl.textContent=user.email||'';
      if(adminBtn)adminBtn.style.display=role==='admin'?'block':'none';
      if(officerBtn)officerBtn.style.display=role==='officer'?'block':'none';
    }catch(e){console.error('Account panel verify:',e);}
  })();
  return true;
}
async function openVerifiedAccount(){
  const client=typeof darkslayersSupabase!=='undefined'?darkslayersSupabase:null;
  if(!client)return baseOpen('login');
  try{
    const result=await client.auth.getSession();
    const user=result.data?.session?.user;
    if(!user)return baseOpen('login');
    const saved=cachedAccount()||{loggedIn:true,label:user.user_metadata?.display_name||'CONTUL MEU',admin:false};
    openLoggedAccount(saved);
  }catch(error){console.error('Account session check:',error);}
}
window.openDarkSlayersAccount=openVerifiedAccount;

const baseOpen=window.openAccountModal;
window.openAccountModal=function(mode='login'){
  if(mode!=='register'){openVerifiedAccount();return;}
  return baseOpen(mode);
};

/* Replace navbar button: removes ALL old listeners and inline onclick. */
const oldButton=document.getElementById('accountButton');
if(oldButton){
  const button=oldButton.cloneNode(true);
  button.removeAttribute('onclick');
  oldButton.replaceWith(button);
  button.addEventListener('click',function(e){
    e.preventDefault();e.stopImmediatePropagation();
    openVerifiedAccount();
  },true);
}

/* Extra capture guard in case another script later attaches a handler. */
document.addEventListener('click',function(e){
  const b=e.target.closest&&e.target.closest('#accountButton');
  if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  openVerifiedAccount();
},true);

/* Force-close avatar moderation before legacy modal handlers can reopen it. */
function dismissAvatarModeration(){
  const modal=document.getElementById('siteModal');
  if(!modal)return;
  modal.classList.remove('open','ds-account-open');
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
document.addEventListener('click',function(event){
  const modal=document.getElementById('siteModal');
  if(!modal||!modal.classList.contains('open'))return;
  if((document.getElementById('siteModalTitle')?.textContent||'').trim().toUpperCase()!=='MODERARE AVATARE')return;
  if(!event.target.closest?.('.site-modal-close, .site-modal-backdrop'))return;
  event.preventDefault();
  event.stopImmediatePropagation();
  dismissAvatarModeration();
},true);
document.addEventListener('keydown',function(event){
  if(event.key!=='Escape')return;
  if((document.getElementById('siteModalTitle')?.textContent||'').trim().toUpperCase()!=='MODERARE AVATARE')return;
  event.preventDefault();event.stopImmediatePropagation();dismissAvatarModeration();
},true);
const closeAll=window.closeSiteModal;
let navigating=false;
window.closeSiteModal=function(){
  if(navigating)return;
  document.getElementById('siteModal')?.classList.remove('ds-account-open');
  const title=(document.getElementById('siteModalTitle')?.textContent||'').trim().toUpperCase();
  if(title==='MODERARE AVATARE')return closeAll();
  if(title==='ADMIN PANEL'||title==='OFFICER PANEL'){
    navigating=true;try{openLoggedAccount();}finally{navigating=false;}return;
  }
  return closeAll();
};
})();
