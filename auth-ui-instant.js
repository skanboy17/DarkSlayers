/* DARKSLAYERS - instant account modal for persisted sessions */
(function(){
'use strict';
function cachedAccount(){
  try{
    const ui=JSON.parse(localStorage.getItem('darkslayers-account-ui')||'null');
    return ui&&ui.loggedIn?ui:null;
  }catch(e){return null;}
}
function loggedPanel(saved){
  const label=String(saved?.label||'CONTUL MEU').replace(/^[♛⚔]\s*/, '');
  const admin=!!saved?.admin;
  return `
    <div id="loggedInPanel" class="auth-logged" style="display:grid">
      <div class="account-profile-card">
        <span id="loggedInRole" class="role-badge ${admin?'role-admin':''}">${admin?'ADMIN':'MEMBER'}</span>
        <strong id="loggedInName">${label}</strong>
        <small id="loggedInEmail"></small>
      </div>
      <button id="adminPanelButton" class="auth-submit admin-panel-button" style="display:${admin?'block':'none'}" onclick="openAdminPanel()">♛ ADMIN PANEL</button>
      <button id="officerPanelButton" class="auth-submit admin-panel-button" style="display:none" onclick="openOfficerPanel()">⚔ OFFICER PANEL</button>
      <button class="auth-submit profile-panel-button" onclick="openMyProfile()">👤 PROFILUL MEU</button>
      <button class="auth-submit auth-logout" onclick="logoutDarkSlayers()">LOGOUT</button>
    </div>`;
}
const original=window.openAccountModal;
window.openAccountModal=function(mode='login'){
  const saved=cachedAccount();
  if(!saved){ return original(mode); }
  openSiteModal({icon:'♛',label:'DARKSLAYERS',title:'CONT',content:loggedPanel(saved)});
  /* Verify/fill real session in background; never paint the login form first. */
  if(typeof refreshAuthModal==='function') Promise.resolve(refreshAuthModal()).catch(()=>{});
};
})();
