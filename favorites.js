let items = [];
let favorites = (() => { try { const value = JSON.parse(localStorage.getItem('mm2_favorites') || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } })();
const container = document.getElementById('favoriteItems');
const favCount = document.getElementById('favCount');
const loader = document.getElementById('loader');
const toast = document.getElementById('toast');

let toastTimeout;
function showToast(message, type = 'success') {
  if (!toast) return;
  toast.textContent = message;
  toast.className = `${type} show`;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

function renderFavorites() {
  const favoriteItems = items.filter(item => favorites.includes(item.id));
  if (favCount) favCount.textContent = favoriteItems.length;
  if (!container) return;

  if (!favoriteItems.length) {
    container.innerHTML = `<div class="empty-state"><div class="icon">♡</div><h2>${mm2t('noFav')}</h2><p>${mm2t('noFavText')}</p><a href="index.html" class="back-btn">${mm2t('homeBack')}</a></div>`;
    return;
  }

  container.innerHTML = favoriteItems.map(item => `
    <div class="card rarity-${item.category}" data-id="${item.id}">
      <button class="fav-btn active" data-id="${item.id}" aria-label="Favoridən çıxar">❤️</button>
      <img src="${item.image || 'default.svg'}" alt="${item.name}" loading="lazy" onerror="this.src='default.svg'">
      <h3>${item.name}</h3><div class="value">💰 ${item.value}</div>
      <div class="category">${item.category}</div><div class="demand">🔥 Tələb: ${item.demand}/10</div>
    </div>`).join('');

  container.querySelectorAll('.card').forEach(card => card.addEventListener('click', event => {
    if (!event.target.closest('.fav-btn')) window.location.href = `detail.html?id=${card.dataset.id}`;
  }));
  container.querySelectorAll('.fav-btn').forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    favorites = favorites.filter(id => id !== button.dataset.id);
    localStorage.setItem('mm2_favorites', JSON.stringify(favorites));
    showToast(mm2t('favorites'), 'error');
    renderFavorites();
  }));
}

async function init() { items = await window.MM2VaultData.loadItems(); renderFavorites(); if (loader) setTimeout(() => loader.classList.add('hidden'), 400); }

document.addEventListener('DOMContentLoaded', init);
