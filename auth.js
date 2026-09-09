const MM2_ADMIN_EMAIL = 'mm2ultimatehub@gmail.com';

function isMm2Admin(user) {
  return Boolean(user?.email && user.email.toLowerCase() === MM2_ADMIN_EMAIL);
}

function startGoogleLogin({ button, status, onSuccess } = {}) {
  if (!window.firebaseAuth) return;
  if (button) {
    button.disabled = true;
    button.textContent = '⏳ Google yoxlanılır...';
  }
  if (status) status.textContent = 'Google hesabı təsdiqlənir...';
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  window.firebaseAuth.signInWithPopup(provider).then(userCredential => {
    if (typeof onSuccess === 'function') onSuccess(userCredential.user);
  }).catch(error => {
    if (status) status.textContent = error.code === 'auth/popup-blocked' ? 'Popup bloklandı. Brauzerdə popup-a icazə ver.' : error.code === 'auth/popup-closed-by-user' ? 'Giriş pəncərəsi bağlandı.' : `Giriş alınmadı: ${error.message}`;
    if (button) {
      button.disabled = false;
      button.textContent = '🔐 Google ilə giriş';
    }
  });
}

function installHomeAuth() {
  const button = document.getElementById('homeGoogleLogin');
  const status = document.getElementById('homeAuthStatus');
  const account = document.getElementById('homeAccount');
  if (!button || !window.firebaseAuth) return;
  window.firebaseAuth.onAuthStateChanged(user => {
    if (!user) {
      button.classList.remove('hidden');
      account?.classList.add('hidden');
      return;
    }
    button.classList.add('hidden');
    account?.classList.remove('hidden');
    if (account) account.innerHTML = `<span>✅ ${user.email}</span>${isMm2Admin(user) ? '<a href="admin.html">🛠️ Admin paneli</a>' : ''}<button id="homeLogout" class="auth-mini-button">Çıxış</button>`;
    document.getElementById('homeLogout')?.addEventListener('click', () => window.firebaseAuth.signOut());
  });
  button.addEventListener('click', () => startGoogleLogin({ button, status }));
}

document.addEventListener('DOMContentLoaded', installHomeAuth);
