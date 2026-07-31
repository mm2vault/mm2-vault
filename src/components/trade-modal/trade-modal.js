// trade-modal.js: opens/closes modal and renders item cards
// Now attempts to fetch real data from /api/trade/items, falls back to sampleItems
(function () {
  const btn = document.getElementById('trade-list-btn');
  const modal = document.getElementById('trade-modal');
  const itemsContainer = document.getElementById('trade-items');
  const closeElements = modal.querySelectorAll('[data-close]');

  // Fallback sample data if API not available
  const sampleItems = [
    { id:1, name: "Kılıç +1", image: "/assets/items/sword.png", value: 120 },
    { id:2, name: "Kalkan", image: "/assets/items/shield.png", value: 85 },
    { id:3, name: "Eliksir (HP)", image: "/assets/items/potion_hp.png", value: 12.5 },
    { id:4, name: "Büyü Taşı", image: "/assets/items/crystal.png", value: 300 }
  ];

  function formatValue(v) {
    if (Number.isInteger(v)) return v + " ₺"; // örnek para birimi
    return v.toLocaleString(undefined, { maximumFractionDigits:2 }) + " ₺";
  }

  function showLoading() {
    itemsContainer.innerHTML = '<p style="color:#6b7280">Yükleniyor…</p>';
  }

  function showError(msg) {
    itemsContainer.innerHTML = `<p style="color:#f43f5e">Hata: ${escapeHtml(msg)}</p>`;
  }

  function renderItems(items) {
    itemsContainer.innerHTML = '';
    if (!items || items.length === 0) {
      itemsContainer.innerHTML = '<p style="color:#6b7280">Gösterilecek eşya yok.</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    items.forEach(it => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `
        <div class="item-card__img"><img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.name)}"></div>
        <div class="item-card__meta">
          <div class="item-card__name">${escapeHtml(it.name)}</div>
          <div class="item-card__value"><span class="value-badge">${formatValue(it.value)}</span></div>
        </div>
      `;
      frag.appendChild(card);
    });
    itemsContainer.appendChild(frag);
  }

  async function fetchItems() {
    // Try to fetch from API endpoint; if it fails, return sampleItems
    try {
      const res = await fetch('/api/trade/items', { credentials: 'same-origin' });
      if (!res.ok) throw new Error('Sunucudan veri alınamadı ('+res.status+')');
      const data = await res.json();
      // Basic validation: expect array of items with name and value
      if (!Array.isArray(data)) throw new Error('Beklenmeyen veri formatı');
      return data.map(d => ({
        id: d.id ?? d.item_id ?? null,
        name: d.name ?? d.title ?? 'İsimsiz eşya',
        image: d.image ?? d.icon ?? '/assets/items/placeholder.png',
        value: d.value ?? d.price ?? 0
      }));
    } catch (err) {
      // fallback
      console.warn('Trade items fetch failed, falling back to sampleItems:', err);
      return sampleItems;
    }
  }

  async function openModal() {
    modal.setAttribute('aria-hidden','false');
    showLoading();
    // Fetch and render
    const items = await fetchItems();
    renderItems(items);
    modal.querySelector('.trade-modal__close')?.focus();
    document.addEventListener('keydown', onKeyDown);
  }

  function closeModal() {
    modal.setAttribute('aria-hidden','true');
    document.removeEventListener('keydown', onKeyDown);
    btn?.focus();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') closeModal();
  }

  closeElements.forEach(el => el.addEventListener('click', closeModal));
  modal.querySelector('.trade-modal__overlay')?.addEventListener('click', closeModal);

  btn && btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('\"','&quot;')
      .replaceAll("'", '&#39;');
  }

})();
