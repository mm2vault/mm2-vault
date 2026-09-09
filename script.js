// ============================================
// MM2 VAULT - ANA SƏHİFƏ JAVASCRIPT
// ============================================

// ---------- STATE ----------
let items = [];
let filteredItems = [];
let favorites = JSON.parse(localStorage.getItem('mm2_favorites')) || [];

// ---------- DOM REFS ----------
const itemsContainer = document.getElementById('itemsContainer');
const topItemsContainer = document.getElementById('topItems');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const itemCountEl = document.getElementById('itemCount');
const favCountEl = document.getElementById('favCount');
const loader = document.getElementById('loader');
const toast = document.getElementById('toast');
const pulseItems = document.getElementById('pulseItems');

// ---------- UTILITY ----------
function formatValue(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace('.0', '')}K`;
  if (value >= 100) return value.toString();
  return value.toString();
}

function isFavorite(id) {
  return favorites.includes(id);
}

function normalizeItems(data) {
  const usedIds = new Set();
  return (data.items || data || []).map((item, index) => {
    const baseId = item.id || item.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const id = usedIds.has(baseId) ? `${baseId}_${index + 1}` : baseId;
    usedIds.add(id);
    return { ...item, id };
  });
}

function updateStats() {
  if (itemCountEl) itemCountEl.textContent = items.length;
  if (favCountEl) favCountEl.textContent = favorites.length;
}

function renderMarketPulse() {
  if (!pulseItems) return;
  const changed = items.filter(item => Number(item.valueChange)).sort((a, b) => Math.abs(b.valueChange) - Math.abs(a.valueChange)).slice(0, 4);
  pulseItems.innerHTML = changed.length ? changed.map(item => {
    const up = Number(item.valueChange) > 0;
    return `<span class="pulse-chip ${up ? 'up' : 'down'}"><b>${up ? '↑' : '↓'}</b> ${item.name} <strong>${up ? '+' : ''}${item.valueChange}</strong></span>`;
  }).join('') : '<span class="pulse-empty">Yeni dəyər dəyişiklikləri burada görünəcək</span>';
}

// ---------- TOAST ----------
let toastTimeout;

function showToast(message, type = 'success') {
  if (!toast) return;
  toast.textContent = message;
  toast.className = type;
  toast.classList.add('show');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// ---------- FAVORITES ----------
function toggleFavorite(id) {
  const index = favorites.indexOf(id);
  if (index > -1) {
    favorites.splice(index, 1);
    showToast('💔 Favorilərdən çıxarıldı', 'error');
  } else {
    favorites.push(id);
    showToast('⭐ Favorilərə əlavə edildi', 'success');
  }
  localStorage.setItem('mm2_favorites', JSON.stringify(favorites));
  updateStats();
  renderAll();
}

// ---------- RENDER CARDS ----------
function renderCards(itemsToRender, container) {
  if (!container) return;
  
  if (!itemsToRender || itemsToRender.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔍</div>
        <p>Heç bir item tapılmadı</p>
        <small style="color:var(--text-muted)">Axtarış və ya filtr parametrlərini dəyişin</small>
      </div>
    `;
    return;
  }

  container.innerHTML = itemsToRender.map(item => {
    const fav = isFavorite(item.id);
    return `
      <div class="card rarity-${item.category}" data-id="${item.id}">
        <button class="fav-btn ${fav ? 'active' : ''}" data-id="${item.id}" aria-label="Favori">
          ${fav ? '❤️' : '🤍'}
        </button>
        <img src="${item.image || 'default.png'}" alt="${item.name}" loading="lazy" onerror="this.src='default.png'" />
        <h3>${item.name}</h3>
        <div class="value">💰 ${formatValue(item.value)}</div>
        <div class="category">${item.category}</div>
        <div class="demand">🔥 Tələb: ${item.demand}/10</div>
      </div>
    `;
  }).join('');

  // Event listeners
  container.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn')) return;
      const id = card.dataset.id;
      window.location.href = `detail.html?id=${id}`;
    });
  });

  container.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      toggleFavorite(id);
    });
  });
}

// ---------- FILTER & SORT ----------
function filterAndSort() {
  const search = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const category = categoryFilter ? categoryFilter.value : 'all';
  const sort = sortFilter ? sortFilter.value : 'default';

  filteredItems = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search);
    const matchCategory = category === 'all' || item.category === category;
    return matchSearch && matchCategory;
  });

  // Sort
  switch (sort) {
    case 'high':
      filteredItems.sort((a, b) => b.value - a.value);
      break;
    case 'low':
      filteredItems.sort((a, b) => a.value - b.value);
      break;
    case 'demand':
      filteredItems.sort((a, b) => b.demand - a.demand);
      break;
    case 'az':
      filteredItems.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'za':
      filteredItems.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
  }

  renderCards(filteredItems, itemsContainer);
}

// ---------- TOP ITEMS ----------
function renderTopItems() {
  if (!topItemsContainer) return;
  
  const top = [...items]
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  if (top.length === 0) {
    topItemsContainer.innerHTML = '<p style="color:var(--text-muted)">Hələ item yoxdur</p>';
    return;
  }

  topItemsContainer.innerHTML = top.map(item => `
    <div class="card rarity-${item.category}" data-id="${item.id}" style="cursor:pointer;">
      <img src="${item.image || 'default.png'}" alt="${item.name}" loading="lazy" onerror="this.src='default.png'" />
      <h3>${item.name}</h3>
      <div class="value">💰 ${formatValue(item.value)}</div>
      <div class="category">${item.category}</div>
    </div>
  `).join('');

  topItemsContainer.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = `detail.html?id=${card.dataset.id}`;
    });
  });
}

// ---------- RENDER ALL ----------
function renderAll() {
  renderMarketPulse();
  renderTopItems();
  filterAndSort();
  updateStats();
}

// ---------- LOAD DATA ----------
async function loadItems() {
  try {
    const response = await fetch('items.json');
    if (!response.ok) throw new Error('items.json tapılmadı');
    const data = await response.json();
    items = normalizeItems(data);
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
    console.warn('items.json yüklənmədi, fallback məlumatlar istifadə olunur:', error);
    // Fallback: əgər items.json yoxdursa
    items = [
      { id: 'travelers_axe', name: "Traveler's Axe", category: 'Unique', value: 1000, demand: 10, image: 'Travellers_Axe.png' },
      { id: 'makeshift', name: 'Makeshift', category: 'Unique', value: 800, demand: 9, image: 'Makeshift.png' },
      { id: 'chroma_luger', name: 'Chroma Luger', category: 'Chroma', value: 450, demand: 9, image: 'Chroma_Luger.png' },
    ];
  }
}

// ---------- INIT ----------
async function init() {
  await loadItems();
  renderAll();

  // Event listeners
  if (searchInput) searchInput.addEventListener('input', filterAndSort);
  if (categoryFilter) categoryFilter.addEventListener('change', filterAndSort);
  if (sortFilter) sortFilter.addEventListener('change', filterAndSort);

  // Hide loader
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 400);
  }
}

// ---------- START ----------
document.addEventListener('DOMContentLoaded', init);
