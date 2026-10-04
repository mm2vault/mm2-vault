// ============================================
// MM2 VAULT - TRADE SƏHİFƏSİ JAVASCRIPT
// ============================================

let items = [];
let giveItems = [];
let takeItems = [];
let giveSearchTerm = '';
let takeSearchTerm = '';

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
let tradeHistory = [];
let tradeHistoryLoaded = false;

async function loadTradeHistory() {
  const local = (() => {
    try {
      const value = JSON.parse(localStorage.getItem('mm2_trade_history') || '[]');
      return Array.isArray(value) ? value : [];
    } catch { return []; }
  })();

  if (!window.firebaseAuth || !window.firebaseDb) {
    tradeHistory = local;
    tradeHistoryLoaded = true;
    return;
  }

  const user = window.firebaseAuth.currentUser;
  if (!user) {
    tradeHistory = local;
    tradeHistoryLoaded = true;
    return;
  }

  try {
    const snapshot = await window.firebaseDb.collection('trades')
      .where('userId', '==', user.uid)
      .limit(50)
      .get();

    tradeHistory = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const aTime = a.createdAt?.toDate?.()?.getTime?.() || Date.parse(a.date) || 0;
        const bTime = b.createdAt?.toDate?.()?.getTime?.() || Date.parse(b.date) || 0;
        return bTime - aTime;
      })
      .slice(0, 20);
    tradeHistoryLoaded = true;
    localStorage.setItem('mm2_trade_history', JSON.stringify(tradeHistory));
  } catch (error) {
    console.warn('[MM2 Vault] Cloud trade history unavailable:', error);
    tradeHistory = local;
    tradeHistoryLoaded = true;
  }
}

// ---------- LOAD DATA ----------
async function loadItems() { items = await window.MM2VaultData.loadItems(); }

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
      <img src="${item.image || 'default.svg'}" alt="${item.name}" onerror="this.src='default.svg'" />
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
      <img src="${item.image || 'default.svg'}" alt="${item.name}" onerror="this.src='default.svg'" />
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

// ---------- TRADE SCORING ----------
function getTradeMetrics(list) {
  const rawValue = list.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const demandTotal = list.reduce((sum, item) => sum + Number(item.demand || 0), 0);
  const averageDemand = list.length ? demandTotal / list.length : 0;
  // Demand gently influences the comparison; value remains the main signal.
  const demandMultiplier = 1 + Math.max(0, averageDemand - 5) * 0.025;
  return { rawValue, averageDemand, adjustedValue: rawValue * demandMultiplier, count: list.length };
}

function updateTradeResult() {
  if (!result) return;

  const give = getTradeMetrics(giveItems);
  const take = getTradeMetrics(takeItems);
  if (!give.rawValue && !take.rawValue) {
    result.className = 'trade-result';
    result.innerHTML = `<span class="trade-status-icon">↔</span><strong>${mm2t('waiting')}</strong><small>${mm2t('selected')}</small>`;
    return;
  }

  const diff = take.adjustedValue - give.adjustedValue;
  const base = Math.max(give.adjustedValue, take.adjustedValue, 1);
  const percent = (Math.abs(diff) / base) * 100;
  const tolerance = Math.max(2, base * 0.025);
  let status = 'fair';
  let title = 'FAIR TRADE';
  let icon = '↔';

  if (diff > tolerance) {
    status = 'win'; title = 'WIN'; icon = '↑';
  } else if (diff < -tolerance) {
    status = 'lose'; title = 'LOSE'; icon = '↓';
  }

  const signed = Math.round(Math.abs(diff) * 10) / 10;
  result.className = `trade-result ${status}`;
  result.innerHTML = `
    <span class="trade-status-icon">${icon}</span>
    <div><strong>${title}</strong><small>${status === 'fair' ? 'Dəyərlər bir-birinə çox yaxındır.' : status === 'win' ? `Təxminən +${signed} adjusted value` : `Təxminən -${signed} adjusted value`}</small></div>
    <div class="trade-metrics"><span>${give.count} item · ${Math.round(give.rawValue)}</span><b>${percent.toFixed(1)}%</b><span>${take.count} item · ${Math.round(take.rawValue)}</span></div>
  `;
}

function renderTradeHistory() {
  if (!tradeHistoryContainer) return;
  tradeHistoryContainer.innerHTML = tradeHistory.length ? tradeHistory.slice(0, 8).map(entry => `<div class="history-row"><span>${new Date(entry.date).toLocaleString()}</span><strong class="${entry.status}">${entry.status.toUpperCase()}</strong><span>${entry.give} → ${entry.take}</span></div>`).join('') : '<p class="admin-muted">Hələ trade tarixçəsi yoxdur.</p>';
}

async function saveTradeHistory() {
  const give = getTradeMetrics(giveItems);
  const take = getTradeMetrics(takeItems);
  if (!give.rawValue && !take.rawValue) return;

  const diff = take.adjustedValue - give.adjustedValue;
  const tolerance = Math.max(2, Math.max(give.adjustedValue, take.adjustedValue, 1) * 0.025);
  const status = diff > tolerance ? 'win' : diff < -tolerance ? 'lose' : 'fair';
  const entry = {
    date: new Date().toISOString(),
    give: Math.round(give.rawValue),
    take: Math.round(take.rawValue),
    status,
    giveCount: give.count,
    takeCount: take.count
  };

  const user = window.firebaseAuth?.currentUser;
  if (user && window.firebaseDb) {
    try {
      await window.firebaseDb.collection('trades').add({
        ...entry,
        userId: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      tradeHistory.unshift(entry);
      tradeHistory = tradeHistory.slice(0, 20);
      localStorage.setItem('mm2_trade_history', JSON.stringify(tradeHistory));
      renderTradeHistory();
      return;
    } catch (error) {
      console.warn('[MM2 Vault] Trade cloud save failed; using local history:', error);
    }
  }

  tradeHistory.unshift(entry);
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
      <img src="${item.image || 'default.svg'}" alt="${item.name}" onerror="this.src='default.svg'" />
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
      <img src="${item.image || 'default.svg'}" alt="${item.name}" onerror="this.src='default.svg'" />
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
  await loadTradeHistory();
  renderTradeHistory();

  // Hide loader
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
}

document.getElementById('clearTradeHistory')?.addEventListener('click', async () => {
  const user = window.firebaseAuth?.currentUser;
  if (user && window.firebaseDb) {
    try {
      const snapshot = await window.firebaseDb.collection('trades').where('userId', '==', user.uid).get();
      const batch = window.firebaseDb.batch();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    } catch (error) {
      console.warn('[MM2 Vault] Cloud trade history clear failed:', error);
    }
  }
  tradeHistory = [];
  localStorage.removeItem('mm2_trade_history');
  renderTradeHistory();
});
document.getElementById('saveTrade')?.addEventListener('click', saveTradeHistory);
window.saveTradeHistory = saveTradeHistory;

document.addEventListener('DOMContentLoaded', initTrade);
