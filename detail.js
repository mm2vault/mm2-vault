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
async function loadItems() { items = await window.MM2VaultData.loadItems(); }

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

  const history = Array.isArray(item.valueHistory) && item.valueHistory.length ? item.valueHistory : [{ value: item.value, changedAt: null }];
  const maxValue = Math.max(...history.map(entry => Number(entry.value) || 0), 1);
  const chart = history.slice(-12).map((entry, index) => `<div class="history-bar" style="height:${Math.max(12, (Number(entry.value) / maxValue) * 100)}%" title="${entry.value}"><span>${entry.value}</span></div>`).join('');
  detailContainer.innerHTML = `
    <div class="detail-card rarity-${item.category}">
      <img src="${item.image || 'default.svg'}" alt="${item.name}" onerror="this.src='default.svg'" />
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
      <div class="value-history"><h2>📈 Dəyər tarixçəsi</h2><div class="history-chart">${chart}</div></div>
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
