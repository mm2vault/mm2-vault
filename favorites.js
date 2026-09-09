let items = [];
let favorites = JSON.parse(localStorage.getItem('mm2_favorites')) || [];
const container = document.getElementById('favoriteItems');
const favCount = document.getElementById('favCount');
const loader = document.getElementById('loader');
const toast = document.getElementById('toast');

function normalizeItems(data) {
  const usedIds = new Set();
  return (data.items || data || []).map((item, index) => {
    const baseId = item.id || item.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const id = usedIds.has(baseId) ? `${baseId}_${index + 1}` : baseId;
    usedIds.add(id);
    return { ...item, id };
  });
}

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
    container.innerHTML = '<div class="empty-state"><div class="icon">💔</div><h2>Hələ favori yoxdur</h2><p>Itemləri ana səhifədən favorilərə əlavə edə bilərsiniz.</p><a href="index.html" class="back-btn">🏠 Ana Səhifəyə dön</a></div>';
    return;
  }

  container.innerHTML = favoriteItems.map(item => `
    <div class="card rarity-${item.category}" data-id="${item.id}">
      <button class="fav-btn active" data-id="${item.id}" aria-label="Favoridən çıxar">❤️</button>
      <img src="${item.image || 'default.png'}" alt="${item.name}" loading="lazy" onerror="this.src='default.png'">
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
    showToast('💔 Favorilərdən çıxarıldı', 'error');
    renderFavorites();
  }));
}

async function init() {
  try {
    const response = await fetch('items.json');
    if (!response.ok) throw new Error('items.json tapılmadı');
    items = normalizeItems(await response.json());
    if (window.firebaseDb) {
      try {
        const cloudSnapshot = await window.firebaseDb.collection('items').get();
        const cloudItems = cloudSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const merged = new Map(items.map(item => [item.id, item]));
        cloudItems.forEach(item => merged.set(item.id, item));
        items = normalizeItems([...merged.values()]);
      } catch (cloudError) {
        console.warn('Cloud itemləri yüklənmədi, JSON istifadə olunur:', cloudError);
      }
    }
  } catch (error) {
    console.warn('items.json yüklənmədi:', error);
  }
  renderFavorites();
  if (loader) setTimeout(() => loader.classList.add('hidden'), 400);
}

document.addEventListener('DOMContentLoaded', init);
