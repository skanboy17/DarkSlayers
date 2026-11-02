/* DARKSLAYERS - account menu + staff back navigation */
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
  return `
    <div id="loggedInPanel" class="auth-logged" style="display:grid">
      <div class="account-profile-card">
        <span id="loggedInRole" class="role-badge ${admin?'role-admin':''}">${admin?'ADMIN':'MEMBER'}</span>
        <strong id="loggedInName">${cleanName(saved?.label)}</strong>
        <small id="loggedInEmail"></small>
      </div>
      <button id="adminPanelButton" class="auth-submit admin-panel-button" style="display:${admin?'block':'none'}" onclick="openAdminPanel()">♛ ADMIN PANEL</button>
      <button id="officerPanelButton" class="auth-submit admin-panel-button" style="display:none" onclick="openOfficerPanel()">⚔ OFFICER PANEL</button>
      <button class="auth-submit profile-panel-button" onclick="openMyProfile()">👤 PROFILUL MEU</button>
      <button class="auth-submit auth-logout" onclick="logoutDarkSlayers()">LOGOUT</button>
    </div>`;
}
function openCachedAccount(){
  const saved=cachedAccount();
  if(!saved)return false;
  openSiteModal({icon:'♛',label:'DARKSLAYERS',title:'CONT',content:accountPanel(saved)});
  (async()=>{
    try{
      const user=typeof getDarkSlayersUser==='function'?await getDarkSlayersUser():null;
      const profile=user&&typeof getDarkSlayersProfile==='function'?await getDarkSlayersProfile(user):null;
      if(!user||!document.getElementById('loggedInPanel'))return;
      const role=String(profile?.role||'member').toLowerCase();
      const roleEl=document.getElementById('loggedInRole');
      const nameEl=document.getElementById('loggedInName');
      const mailEl=document.getElementById('loggedInEmail');
      const adminBtn=document.getElementById('adminPanelButton');
      const officerBtn=document.getElementById('officerPanelButton');
      if(roleEl){roleEl.textContent=role.toUpperCase();roleEl.classList.toggle('role-admin',role==='admin');}
      if(nameEl)nameEl.textContent=profile?.display_name||user.user_metadata?.display_name||cleanName(saved.label);
      if(mailEl)mailEl.textContent=user.email||'';
      if(adminBtn)adminBtn.style.display=role==='admin'?'block':'none';
      if(officerBtn)officerBtn.style.display=role==='officer'?'block':'none';
    }catch(e){console.error('Account verify:',e);}
  })();
  return true;
}

function installAccountButton(){
  const button=document.getElementById('accountButton');
  if(!button||button.dataset.dsAccountNav==='1')return;
  button.dataset.dsAccountNav='1';
  button.addEventListener('click',function(e){
    if(!cachedAccount())return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openCachedAccount();
  },true);
}

/* Intercept the modal X before old handlers. It works as Back on nested staff pages. */
document.addEventListener('click',function(e){
  const close=e.target.closest('.modal-close, .site-modal-close, [onclick*="closeSiteModal"]');
  if(!close)return;
  const title=(document.getElementById('siteModalTitle')?.textContent||'').trim().toUpperCase();
  if(title==='ADMIN PANEL'||title==='OFFICER PANEL'){
    e.preventDefault();e.stopImmediatePropagation();openCachedAccount();return;
  }
  if(title==='MODERARE AVATARE'){
    e.preventDefault();e.stopImmediatePropagation();
    const saved=cachedAccount();
    if(saved?.admin&&typeof openAdminPanel==='function')openAdminPanel();
    else if(typeof openOfficerPanel==='function')openOfficerPanel();
  }
},true);

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installAccountButton,{once:true});else installAccountButton();
})();
