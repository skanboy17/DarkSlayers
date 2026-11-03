/* DARKSLAYERS - Admin/Officer nested modal navigation */
(function(){
  if(typeof window.closeSiteModal !== 'function') return;

  const originalCloseSiteModal = window.closeSiteModal;
  let returning = false;

  window.closeSiteModal = function(){
    if(returning) return originalCloseSiteModal();

    const title = (document.getElementById('siteModalTitle')?.textContent || '').trim().toUpperCase();
    if(title === 'MODERARE AVATARE'){
      returning = true;
      Promise.resolve().then(async function(){
        try{
          const role = String(window.DARKSLAYERS_CURRENT_PROFILE?.role || '').toLowerCase();
          if(role === 'admin' && typeof window.openAdminPanel === 'function'){
            await window.openAdminPanel();
            return;
          }
          if(role === 'officer' && typeof window.openOfficerPanel === 'function'){
            await window.openOfficerPanel();
            return;
          }
          if(typeof window.getDarkSlayersUser === 'function' && typeof window.getDarkSlayersProfile === 'function'){
            const user = await window.getDarkSlayersUser();
            const profile = user ? await window.getDarkSlayersProfile(user) : null;
            if(profile?.role === 'admin' && typeof window.openAdminPanel === 'function') return window.openAdminPanel();
            if(profile?.role === 'officer' && typeof window.openOfficerPanel === 'function') return window.openOfficerPanel();
          }
          originalCloseSiteModal();
        } finally {
          returning = false;
        }
      });
      return;
    }

    return originalCloseSiteModal();
  };
})();
