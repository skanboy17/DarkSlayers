/* DARKSLAYERS - MEMBER PROFILE V2 MODAL SIZE FIX */
(function(){
'use strict';
function applyProfileV2ModalFix(){
 var old=document.getElementById('ds-profile-v2-modal-fix');
 if(old) old.remove();
 var s=document.createElement('style');
 s.id='ds-profile-v2-modal-fix';
 s.textContent=`
 #dsMemberProfileV2.ds-v2-overlay{position:fixed!important;inset:0!important;z-index:100001!important;background:rgba(0,0,0,.86)!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:18px!important;overflow:hidden!important}
 #dsMemberProfileV2 .ds-v2{position:relative!important;width:min(1120px,94vw)!important;max-width:1120px!important;max-height:88vh!important;overflow:auto!important;margin:0!important;padding:18px!important;background:linear-gradient(145deg,#0c0808,#050505)!important;border:1px solid #6d2025!important;box-shadow:0 0 45px rgba(180,20,30,.32)!important;color:#eee!important}
 #dsMemberProfileV2 .ds-v2-close{position:absolute!important;right:12px!important;top:12px!important;z-index:10!important;width:40px!important;height:40px!important}
 #dsMemberProfileV2 .ds-v2-head{margin-top:0!important;padding:18px!important;grid-template-columns:110px minmax(0,1fr)!important;gap:18px!important}
 #dsMemberProfileV2 .ds-v2-avatar{width:110px!important;height:110px!important}
 #dsMemberProfileV2 .ds-v2-name{font-size:34px!important}
 #dsMemberProfileV2 .ds-v2-layout{grid-template-columns:270px minmax(0,1fr) 270px!important;gap:12px!important;margin-top:12px!important}
 #dsMemberProfileV2 .ds-v2-title{padding:10px 12px!important;font-size:14px!important}
 #dsMemberProfileV2 .ds-v2-content{padding:11px!important}
 #dsMemberProfileV2 .ds-v2-box{margin-bottom:12px!important}
 @media(max-width:980px){#dsMemberProfileV2 .ds-v2{width:min(760px,95vw)!important}#dsMemberProfileV2 .ds-v2-layout{grid-template-columns:1fr 1fr!important}#dsMemberProfileV2 .ds-v2-right{grid-column:1/-1!important}}
 @media(max-width:680px){#dsMemberProfileV2.ds-v2-overlay{padding:8px!important}#dsMemberProfileV2 .ds-v2{width:97vw!important;max-height:94vh!important;padding:10px!important}#dsMemberProfileV2 .ds-v2-head{grid-template-columns:1fr!important;text-align:center!important;padding-top:48px!important}#dsMemberProfileV2 .ds-v2-avatar{margin:auto!important;width:90px!important;height:90px!important}#dsMemberProfileV2 .ds-v2-layout{grid-template-columns:1fr!important}#dsMemberProfileV2 .ds-v2-right{grid-column:auto!important}}
 `;
 document.head.appendChild(s);
}
applyProfileV2ModalFix();
var obs=new MutationObserver(function(){if(document.getElementById('dsMemberProfileV2'))applyProfileV2ModalFix()});
obs.observe(document.documentElement,{childList:true,subtree:true});
})();
