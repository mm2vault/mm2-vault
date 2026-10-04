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