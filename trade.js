let allItems = [];

fetch("items.json")
  .then(res => res.json())
  .then(data => {
    allItems = data;
    // prepare UI
    attachSearchHandlers();
  })
  .catch(err => console.error('items.json yüklenemedi:', err));

// State for selected items
const giveSelectedItems = [];
const takeSelectedItems = [];

function attachSearchHandlers() {
  const giveSearch = document.getElementById('giveSearch');
  const takeSearch = document.getElementById('takeSearch');

  if (giveSearch) {
    giveSearch.addEventListener('input', () => renderGiveResults());
  }
  if (takeSearch) {
    takeSearch.addEventListener('input', () => renderTakeResults());
  }
}

function toggleGiveList() {
  const area = document.getElementById('giveResults');
  if (!area) return;
  if (area.innerHTML.trim() === '') {
    renderGiveResults();
  } else {
    area.innerHTML = '';
  }
}

function toggleTakeList() {
  const area = document.getElementById('takeResults');
  if (!area) return;
  if (area.innerHTML.trim() === '') {
    renderTakeResults();
  } else {
    area.innerHTML = '';
  }
}

function renderGiveResults() {
  const area = document.getElementById('giveResults');
  if (!area) return;
  const q = (document.getElementById('giveSearch')?.value || '').toLowerCase();
  const filtered = allItems.filter(i => i.name.toLowerCase().includes(q));
  area.innerHTML = filtered.map(i => renderResultRow(i, 'give')).join('');
}

function renderTakeResults() {
  const area = document.getElementById('takeResults');
  if (!area) return;
  const q = (document.getElementById('takeSearch')?.value || '').toLowerCase();
  const filtered = allItems.filter(i => i.name.toLowerCase().includes(q));
  area.innerHTML = filtered.map(i => renderResultRow(i, 'take')).join('');
}

function renderResultRow(item, side) {
  // side: 'give' or 'take'
  const escaped = escapeHtml(item.name);
  return `
    <div class="trade-row" onclick="selectItem('${side}', ${JSON.stringify(item)})">
      <div class="trade-row-left">
        <img src="${item.image || 'default.png'}" onerror="this.src='default.png'" class="thumb"/>
        <strong>${escaped}</strong>
      </div>
      <div class="trade-row-right">💰 ${item.value}</div>
    </div>
  `;
}

function selectItem(side, item) {
  // item is an object
  const list = side === 'give' ? giveSelectedItems : takeSelectedItems;
  const container = document.getElementById(side + 'Selected');
  const existingIndex = list.findIndex(x => x.name === item.name);
  if (existingIndex >= 0) {
    // remove
    list.splice(existingIndex, 1);
  } else {
    list.push(item);
  }
  renderSelected(side, container, list);
  updateValues();
}

function renderSelected(side, container, list) {
  if (!container) container = document.getElementById(side + 'Selected');
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = '<p>Seçili item yok</p>';
    return;
  }
  container.innerHTML = list.map(i => `
    <div class="selected-row">
      <span>${escapeHtml(i.name)}</span>
      <span>💰 ${i.value}</span>
    </div>
  `).join('');
}

function updateValues() {
  const giveVal = giveSelectedItems.reduce((s, i) => s + (Number(i.value) || 0), 0);
  const takeVal = takeSelectedItems.reduce((s, i) => s + (Number(i.value) || 0), 0);
  const gv = document.getElementById('giveValue');
  const tv = document.getElementById('takeValue');
  if (gv) gv.textContent = giveVal;
  if (tv) tv.textContent = takeVal;
  // Update result area
  const result = document.getElementById('result');
  if (result) {
    if (giveVal === 0 && takeVal === 0) {
      result.textContent = '⚖️ Trade bekleniyor...';
    } else {
      result.textContent = `⚖️ Sen: ${giveVal} — Karşı: ${takeVal}`;
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Expose functions for inline onclick in HTML
window.toggleGiveList = toggleGiveList;
window.toggleTakeList = toggleTakeList;
window.selectItem = selectItem;
