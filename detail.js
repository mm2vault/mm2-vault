// ============================================
// MM2 VAULT - DETAY SƏHİFƏSİ JAVASCRIPT
// ============================================

let items = [];

// ---------- DOM REFS ----------
const detailContainer = document.getElementById('detail');
const loader = document.getElementById('loader');

// ---------- GET ITEM ID FROM URL ----------
function getItemId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// ---------- LOAD DATA ----------
async function loadItems() {
  try {
    const res = await fetch('items.json');
    if (!res.ok) throw new Error('items.json tapılmadı');
    const data = await res.json();
    items = data.items || data || [];
  } catch (error) {
    console.warn('items.json yüklənmədi, fallback istifadə olunur:', error);
    items = [
      { id: 'travelers_axe', name: "Traveler's Axe", category: 'Unique', value: 1000, demand: 10, image: 'Travellers_Axe.png', year: 2023, type: 'Knife' },
      { id: 'makeshift', name: 'Makeshift', category: 'Unique', value: 800, demand: 9, image: 'Makeshift.png', year: 2023, type: 'Knife' },
    ];
  }
}

// ---------- RENDER DETAIL ----------
function renderDetail(itemId) {
  if (!detailContainer) return;

  const item = items.find(i => i.id === itemId);

  if (!item) {
    detailContainer.innerHTML = `
      <div class="empty-state" style="padding:40px;">
        <div class="icon">❌</div>
        <h2>Item tapılmadı</h2>
        <p style="color:var(--text-muted)">Bu ID ilə heç bir item yoxdur</p>
        <a href="index.html" class="back-btn" style="display:inline-block;margin-top:16px;">🏠 Ana Səhifəyə dön</a>
      </div>
    `;
    return;
  }

  detailContainer.innerHTML = `
    <div class="detail-card rarity-${item.category}">
      <img src="${item.image || 'default.png'}" alt="${item.name}" onerror="this.src='default.png'" />
      <h1>${item.name}</h1>
      <div class="value-big">💰 ${item.value}</div>
      <div style="color:var(--text-secondary);font-size:14px;margin-top:4px;">
        ${item.category} • ${item.type || 'Unknown'}
      </div>
      <div class="detail-info">
        <p><strong>Kateqoriya</strong> ${item.category || '—'}</p>
        <p><strong>Dəyər</strong> ${item.value}</p>
        <p><strong>Tələb</strong> ${item.demand || 0}/10</p>
        <p><strong>Tip</strong> ${item.type || '—'}</p>
        <p><strong>İl</strong> ${item.year || '—'}</p>
        ${item.description ? `<p><strong>Təsvir</strong> ${item.description}</p>` : ''}
      </div>
      <a href="index.html" class="back-btn" style="display:inline-block;margin-top:16px;">🏠 Ana Səhifəyə dön</a>
    </div>
  `;
}

// ---------- INIT ----------
async function initDetail() {
  await loadItems();
  const id = getItemId();
  renderDetail(id);

  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
}

document.addEventListener('DOMContentLoaded', initDetail);
