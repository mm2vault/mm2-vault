// MM2 VAULT — shared admin navigation guard
(function () {
  const ADMIN_EMAIL = 'mm2ultimatehub@gmail.com';
  function apply(user) {
    const allowed = !!user && String(user.email || '').toLowerCase() === ADMIN_EMAIL;
    document.querySelectorAll('[data-admin-only]').forEach(el => {
      el.classList.toggle('hidden', !allowed);
      el.setAttribute('aria-hidden', String(!allowed));
    });
  }
  function applyPremiumSubpage(){
    const path=location.pathname.toLowerCase();
    const cls=path.includes('profile')?'vault-profile':path.includes('favorites')?'vault-favorites':path.includes('detail')?'vault-detail':'';
    if(cls) document.body.classList.add(cls);
    if(!document.querySelector('link[data-subpage-premium]')){
      const link=document.createElement('link'); link.rel='stylesheet'; link.href='subpages-premium.css'; link.dataset.subpagePremium='1'; document.head.appendChild(link);
    }
  }
  function init() {
    if (window.firebaseAuth && typeof window.firebaseAuth.onAuthStateChanged === 'function') {
      window.firebaseAuth.onAuthStateChanged(apply);
    } else {
      apply(null);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();