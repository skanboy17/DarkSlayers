/* DARKSLAYERS - instant account modal for persisted sessions */
(function(){
'use strict';
function cachedAccount(){
  try{
    const ui=JSON.parse(localStorage.getItem('darkslayers-account-ui')||'null');
    return !!(ui&&ui.loggedIn&&ui.label);
  }catch(e){return false;}
}
function install(){
  if(typeof window.openAccountModal!=='function')return;
  const original=window.openAccountModal;
  window.openAccountModal=function(mode='login'){
    if(cachedAccount() && mode!=='register'){
      if(typeof window.openSiteModal==='function'){
        window.openSiteModal({icon:'♛',label:'DARKSLAYERS',title:'CONT',content:'<div id="dsAccountOpening" class="modal-highlight">Se deschide contul...</div>'});
      }
      Promise.resolve().then(async function(){
        try{
          const user=typeof window.getDarkSlayersUser==='function'?await window.getDarkSlayersUser():null;
          if(user){
            const profile=typeof window.getDarkSlayersProfile==='function'?await window.getDarkSlayersProfile(user):null;
            if(profile&&profile.role==='admin'&&typeof window.openAdminPanel==='function'){await window.openAdminPanel();return;}
            if(profile&&profile.role==='officer'&&typeof window.openOfficerPanel==='function'){await window.openOfficerPanel();return;}
          }
        }catch(e){console.error('DARKSLAYERS instant account:',e);}
        original(mode);
      });
      return;
    }
    return original(mode);
  };
}
install();
})();
