// ============================================
// MM2 VAULT - TRADE SƏHİFƏSİ JAVASCRIPT
// ============================================

let items = [];
let giveItems = [];
let takeItems = [];
let giveSearchTerm = '';
let takeSearchTerm = '';

function normalizeItems(data) {
  const usedIds = new Set();
  return (data.items || data || []).map((item, index) => {
    const baseId = item.id || item.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const id = usedIds.has(baseId) ? `${baseId}_${index + 1}` : baseId;
    usedIds.add(id);
    return { ...item, id };
  });
}

// ---------- DOM REFS ----------
const giveSearch = document.getElementById('giveSearch');
const takeSearch = document.getElementById('takeSearch');
const giveResults = document.getElementById('giveResults');
const takeResults = document.getElementById('takeResults');
const giveSelected = document.getElementById('giveSelected');
const takeSelected = document.getElementById('takeSelected');
const giveValue = document.getElementById('giveValue');
const takeValue = document.getElementById('takeValue');
const result = document.getElementById('result');
const tradeHistoryContainer = document.getElementById('tradeHistory');
let tradeHistory = JSON.parse(localStorage.getItem('mm2_trade_history') || '[]');

// ---------- LOAD DATA ----------
async function loadItems() {
  try {
    const res = await fetch('items.json');
    if (!res.ok) throw new Error('items.json tapılmadı');
    const data = await res.json();
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
    console.warn('items.json yüklənmədi, fallback istifadə olunur:', error);
    items = [
      { id: 'travelers_axe', name: "Traveler's Axe", value: 1000, image: 'Travellers_Axe.png', category: 'Unique' },
      { id: 'makeshift', name: 'Makeshift', value: 800, image: 'Makeshift.png', category: 'Unique' },
      { id: 'chroma_luger', name: 'Chroma Luger', value: 450, image: 'Chroma_Luger.png', category: 'Chroma' },
    ];
  }
}

// ---------- RENDER RESULTS ----------
function renderResults(searchTerm, container, selectedItems, type) {
  if (!container) return;

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedItems.some(s => s.id === item.id)
  );

  if (filtered.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);padding:12px;">🔍 Heç bir nəticə tapılmadı</p>';
    return;
  }

  container.innerHTML = filtered.slice(0, 30).map(item => `
    <div class="item" data-id="${item.id}">
      <img src="${item.image || 'default.png'}" alt="${item.name}" onerror="this.src='default.png'" />
      <div class="meta">
        <h4>${item.name}</h4>
        <p>💰 ${item.value} • ${item.category || ''}</p>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const item = items.find(i => i.id === id);
      if (!item) return;
      
      if (type === 'give') {
        giveItems.push(item);
        renderSelected('give');
        renderResults(giveSearchTerm, giveResults, giveItems, 'give');
      } else {
        takeItems.push(item);
        renderSelected('take');
        renderResults(takeSearchTerm, takeResults, takeItems, 'take');
      }
      updateTradeResult();
    });
  });
}

// ---------- RENDER SELECTED ----------
function renderSelected(type) {
  const container = type === 'give' ? giveSelected : takeSelected;
  const itemsList = type === 'give' ? giveItems : takeItems;
  const valueEl = type === 'give' ? giveValue : takeValue;

  if (!container) return;

  if (itemsList.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:14px;">Heç bir item seçilməyib</p>';
    if (valueEl) valueEl.textContent = '0';
    return;
  }

  container.innerHTML = itemsList.map((item, index) => `
    <div class="trade-item">
      <img src="${item.image || 'default.png'}" alt="${item.name}" onerror="this.src='default.png'" />
      <span style="flex:1;">${item.name}</span>
      <span style="color:var(--gold);font-weight:700;">💰 ${item.value}</span>
      <button onclick="removeItem('${type}', ${index})">✕</button>
    </div>
  `).join('');

  const total = itemsList.reduce((sum, item) => sum + item.value, 0);
  if (valueEl) valueEl.textContent = total;
}

// ---------- REMOVE ITEM ----------
window.removeItem = function(type, index) {
  if (type === 'give') {
    giveItems.splice(index, 1);
    renderSelected('give');
    renderResults(giveSearchTerm, giveResults, giveItems, 'give');
  } else {
    takeItems.splice(index, 1);
    renderSelected('take');
    renderResults(takeSearchTerm, takeResults, takeItems, 'take');
  }
  updateTradeResult();
};

// ---------- UPDATE TRADE RESULT ----------
function updateTradeResult() {
  if (!result) return;

  const giveTotal = giveItems.reduce((sum, item) => sum + item.value, 0);
  const takeTotal = takeItems.reduce((sum, item) => sum + item.value, 0);

  if (giveTotal === 0 && takeTotal === 0) {
    result.className = 'trade-result';
    result.innerHTML = '⚖️ Trade gözləyir...';
    return;
  }

  const diff = takeTotal - giveTotal;
  let status = 'fair';
  let emoji = '⚖️';
  let text = 'Bərabər Trade!';

  if (diff > 0) {
    status = 'win';
    emoji = '✅';
    text = `Sən qazanırsan! ${Math.abs(diff)} dəyər`;
  } else if (diff < 0) {
    status = 'lose';
    emoji = '❌';
    text = `Sən zərərdəsən! ${Math.abs(diff)} dəyər`;
  }

  result.className = `trade-result ${status}`;
  result.innerHTML = `
    ${emoji} ${text}
    <small>Sən: ${giveTotal} ⚖️ Qarşı: ${takeTotal}</small>
  `;
}

function renderTradeHistory() {
  if (!tradeHistoryContainer) return;
  tradeHistoryContainer.innerHTML = tradeHistory.length ? tradeHistory.slice(0, 8).map(entry => `<div class="history-row"><span>${new Date(entry.date).toLocaleString()}</span><strong class="${entry.status}">${entry.status.toUpperCase()}</strong><span>${entry.give} → ${entry.take}</span></div>`).join('') : '<p class="admin-muted">Hələ trade tarixçəsi yoxdur.</p>';
}

function saveTradeHistory() {
  const giveTotal = giveItems.reduce((sum, item) => sum + item.value, 0);
  const takeTotal = takeItems.reduce((sum, item) => sum + item.value, 0);
  if (!giveTotal && !takeTotal) return;
  const status = takeTotal > giveTotal ? 'win' : takeTotal < giveTotal ? 'lose' : 'fair';
  tradeHistory.unshift({ date: new Date().toISOString(), give: giveTotal, take: takeTotal, status });
  tradeHistory = tradeHistory.slice(0, 20);
  localStorage.setItem('mm2_trade_history', JSON.stringify(tradeHistory));
  renderTradeHistory();
}

// ---------- TOGGLE LIST (Show All) ----------
window.toggleGiveList = function() {
  if (!giveResults) return;
  const allItems = items.filter(item => !giveItems.some(s => s.id === item.id));
  if (giveResults.innerHTML.includes('Bütün itemlər')) {
    renderResults(giveSearchTerm, giveResults, giveItems, 'give');
    return;
  }
  giveResults.innerHTML = allItems.map(item => `
    <div class="item" data-id="${item.id}">
      <img src="${item.image || 'default.png'}" alt="${item.name}" onerror="this.src='default.png'" />
      <div class="meta">
        <h4>${item.name}</h4>
        <p>💰 ${item.value} • ${item.category || ''}</p>
      </div>
    </div>
  `).join('');
  giveResults.querySelectorAll('.item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const item = items.find(i => i.id === id);
      if (!item) return;
      giveItems.push(item);
      renderSelected('give');
      renderResults(giveSearchTerm, giveResults, giveItems, 'give');
      updateTradeResult();
    });
  });
  giveResults.innerHTML += '<p style="color:var(--text-muted);padding:8px;font-size:13px;">📋 Bütün itemlər göstərilir</p>';
};

window.toggleTakeList = function() {
  if (!takeResults) return;
  const allItems = items.filter(item => !takeItems.some(s => s.id === item.id));
  if (takeResults.innerHTML.includes('Bütün itemlər')) {
    renderResults(takeSearchTerm, takeResults, takeItems, 'take');
    return;
  }
  takeResults.innerHTML = allItems.map(item => `
    <div class="item" data-id="${item.id}">
      <img src="${item.image || 'default.png'}" alt="${item.name}" onerror="this.src='default.png'" />
      <div class="meta">
        <h4>${item.name}</h4>
        <p>💰 ${item.value} • ${item.category || ''}</p>
      </div>
    </div>
  `).join('');
  takeResults.querySelectorAll('.item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const item = items.find(i => i.id === id);
      if (!item) return;
      takeItems.push(item);
      renderSelected('take');
      renderResults(takeSearchTerm, takeResults, takeItems, 'take');
      updateTradeResult();
    });
  });
  takeResults.innerHTML += '<p style="color:var(--text-muted);padding:8px;font-size:13px;">📋 Bütün itemlər göstərilir</p>';
};

// ---------- INIT ----------
async function initTrade() {
  await loadItems();

  if (giveSearch) {
    giveSearch.addEventListener('input', (e) => {
      giveSearchTerm = e.target.value;
      renderResults(giveSearchTerm, giveResults, giveItems, 'give');
    });
  }

  if (takeSearch) {
    takeSearch.addEventListener('input', (e) => {
      takeSearchTerm = e.target.value;
      renderResults(takeSearchTerm, takeResults, takeItems, 'take');
    });
  }

  renderSelected('give');
  renderSelected('take');
  renderResults('', giveResults, giveItems, 'give');
  renderResults('', takeResults, takeItems, 'take');
  updateTradeResult();
  renderTradeHistory();

  // Hide loader
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
}

document.getElementById('clearTradeHistory')?.addEventListener('click', () => { tradeHistory = []; localStorage.removeItem('mm2_trade_history'); renderTradeHistory(); });
document.getElementById('saveTrade')?.addEventListener('click', saveTradeHistory);
window.saveTradeHistory = saveTradeHistory;

document.addEventListener('DOMContentLoaded', initTrade);
