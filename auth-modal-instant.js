/* DARKSLAYERS - legacy compatibility only.
   IMPORTANT: persisted sessions must open CONTUL MEU, never ADMIN/OFFICER directly.
   Account navigation is handled by account-navigation-v2.js. */
(function(){
'use strict';
function cachedAccount(){
  try{
    const ui=JSON.parse(localStorage.getItem('darkslayers-account-ui')||'null');
    return ui&&ui.loggedIn?ui:null;
  }catch(e){return null;}
}
function install(){
  if(typeof window.openAccountModal!=='function')return;
  const original=window.openAccountModal;
  window.openAccountModal=function(mode='login'){
    if(mode!=='register'&&cachedAccount()&&typeof window.openDarkSlayersAccount==='function'){
      window.openDarkSlayersAccount();
      return;
    }
    return original(mode);
  };
}
install();
})();
