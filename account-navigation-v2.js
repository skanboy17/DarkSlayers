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
  try{return await realOpenAdmin();}finally{staffOpenAllowed=false;}
}
async function openOfficerAllowed(){
  if(!realOpenOfficer)return;
  staffOpenAllowed=true;
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
    <button id="adminPanelButton" class="auth-submit admin-panel-button" style="display:${admin?'block':'none'}" onclick="openAdminPanelFromAccount()">♛ ADMIN PANEL</button>
    <button id="officerPanelButton" class="auth-submit admin-panel-button" style="display:none" onclick="openOfficerPanelFromAccount()">⚔ OFFICER PANEL</button>
    <button class="auth-submit profile-panel-button" onclick="openMyProfile()">👤 PROFILUL MEU</button>
    <button class="auth-submit profile-panel-button" onclick="openDarkSlayersProfileEditorV2()">✎ EDITEAZA PROFILUL</button>
    <button class="auth-submit auth-logout" onclick="logoutDarkSlayers()">LOGOUT</button>
  </div>`;
}

function openLoggedAccount(){
  const saved=cachedAccount();
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
window.openDarkSlayersAccount=openLoggedAccount;

const baseOpen=window.openAccountModal;
window.openAccountModal=function(mode='login'){
  if(mode!=='register'&&openLoggedAccount())return;
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
    if(cachedAccount())openLoggedAccount();else baseOpen('login');
  },true);
}

/* Extra capture guard in case another script later attaches a handler. */
document.addEventListener('click',function(e){
  const b=e.target.closest&&e.target.closest('#accountButton');
  if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(cachedAccount())openLoggedAccount();else baseOpen('login');
},true);

const closeAll=window.closeSiteModal;
let navigating=false;
window.closeSiteModal=function(){
  if(navigating)return;
  const title=(document.getElementById('siteModalTitle')?.textContent||'').trim().toUpperCase();
  if(title==='MODERARE AVATARE'){
    navigating=true;
    Promise.resolve().then(async()=>{
      try{
        const saved=cachedAccount();
        if(saved?.admin)await openAdminAllowed();
        else if(typeof getDarkSlayersUser==='function'&&typeof getDarkSlayersProfile==='function'){
          const user=await getDarkSlayersUser();const profile=user?await getDarkSlayersProfile(user):null;
          if(profile?.role==='admin')await openAdminAllowed();
          else if(profile?.role==='officer')await openOfficerAllowed();
          else openLoggedAccount();
        }else openLoggedAccount();
      }finally{navigating=false;}
    });
    return;
  }
  if(title==='ADMIN PANEL'||title==='OFFICER PANEL'){
    navigating=true;try{openLoggedAccount();}finally{navigating=false;}return;
  }
  return closeAll();
};
})();
