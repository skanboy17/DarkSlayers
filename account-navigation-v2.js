/* DARKSLAYERS - single account navigation flow */
(function(){
'use strict';

function cachedAccount(){
  try{
    const ui=JSON.parse(localStorage.getItem('darkslayers-account-ui')||'null');
    return ui&&ui.loggedIn?ui:null;
  }catch(e){return null;}
}
function cleanName(value){return String(value||'CONTUL MEU').replace(/^[♛⚔]\s*/, '').trim();}
function accountPanel(saved){
  const admin=!!saved?.admin;
  const label=cleanName(saved?.label);
  return `<div id="loggedInPanel" class="auth-logged" style="display:grid">
    <div class="account-profile-card">
      <span id="loggedInRole" class="role-badge ${admin?'role-admin':''}">${admin?'GUILD MASTER':'MEMBER'}</span>
      <strong id="loggedInName">${label}</strong>
      <small id="loggedInEmail"></small>
    </div>
    <button id="adminPanelButton" class="auth-submit admin-panel-button" style="display:${admin?'block':'none'}" onclick="openAdminPanel()">♛ ADMIN PANEL</button>
    <button id="officerPanelButton" class="auth-submit admin-panel-button" style="display:none" onclick="openOfficerPanel()">⚔ OFFICER PANEL</button>
    <button class="auth-submit profile-panel-button" onclick="openMyProfile()">👤 PROFILUL MEU</button>
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
      const user=await getDarkSlayersUser();
      if(!user)return;
      const profile=await getDarkSlayersProfile(user);
      if(!document.getElementById('loggedInPanel'))return;
      const role=String(profile?.role||'member').toLowerCase();
      const name=profile?.display_name||user.user_metadata?.display_name||cleanName(saved.label);
      const roleEl=document.getElementById('loggedInRole');
      const nameEl=document.getElementById('loggedInName');
      const mailEl=document.getElementById('loggedInEmail');
      const adminBtn=document.getElementById('adminPanelButton');
      const officerBtn=document.getElementById('officerPanelButton');
      if(roleEl){roleEl.textContent=role==='admin'?'GUILD MASTER':role.toUpperCase();roleEl.classList.toggle('role-admin',role==='admin');}
      if(nameEl)nameEl.textContent=name;
      if(mailEl)mailEl.textContent=user.email||'';
      if(adminBtn)adminBtn.style.display=role==='admin'?'block':'none';
      if(officerBtn)officerBtn.style.display=role==='officer'?'block':'none';
    }catch(e){console.error('Account panel verify:',e);}
  })();
  return true;
}

const baseOpen=window.openAccountModal;
window.openAccountModal=function(mode='login'){
  if(mode!=='register'&&openLoggedAccount())return;
  return baseOpen(mode);
};

/* IMPORTANT: replace the navbar button with a clean clone.
   This removes every legacy click listener that could open ADMIN PANEL directly. */
const oldButton=document.getElementById('accountButton');
if(oldButton){
  const button=oldButton.cloneNode(true);
  button.removeAttribute('onclick');
  oldButton.replaceWith(button);
  button.addEventListener('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    const saved=cachedAccount();
    if(saved){openLoggedAccount();return;}
    baseOpen('login');
  });
}

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
        if(saved?.admin&&typeof openAdminPanel==='function')await openAdminPanel();
        else if(typeof getDarkSlayersUser==='function'&&typeof getDarkSlayersProfile==='function'){
          const user=await getDarkSlayersUser();
          const profile=user?await getDarkSlayersProfile(user):null;
          if(profile?.role==='admin'&&typeof openAdminPanel==='function')await openAdminPanel();
          else if(profile?.role==='officer'&&typeof openOfficerPanel==='function')await openOfficerPanel();
          else openLoggedAccount();
        }else openLoggedAccount();
      }finally{navigating=false;}
    });
    return;
  }
  if(title==='ADMIN PANEL'||title==='OFFICER PANEL'){
    navigating=true;
    try{openLoggedAccount();}finally{navigating=false;}
    return;
  }
  return closeAll();
};
})();
