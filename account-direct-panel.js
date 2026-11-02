/* DARKSLAYERS - direct staff account panel, no login flash */
(function(){
'use strict';
function cachedStaffRole(){
  try{
    const ui=JSON.parse(localStorage.getItem('darkslayers-account-ui')||'null');
    if(!ui||!ui.loggedIn)return '';
    if(ui.admin)return 'admin';
    const label=String(ui.label||'').toLowerCase();
    if(label.includes('officer'))return 'officer';
  }catch(e){}
  return '';
}
function install(){
  const button=document.getElementById('accountButton');
  if(!button||button.dataset.dsDirectPanel==='1')return;
  button.dataset.dsDirectPanel='1';
  button.addEventListener('click',function(e){
    const role=cachedStaffRole();
    if(!role)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if(role==='admin'&&typeof openAdminPanel==='function'){openAdminPanel();return;}
    if(role==='officer'&&typeof openOfficerPanel==='function'){openOfficerPanel();return;}
  },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
