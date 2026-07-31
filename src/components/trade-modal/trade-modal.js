// trade-modal.js: opens/closes modal and renders item cards
(function () {
  const btn = document.getElementById('trade-list-btn');
  const modal = document.getElementById('trade-modal');
  const itemsContainer = document.getElementById('trade-items');
  const closeElements = modal.querySelectorAll('[data-close]');

  // Örnek veri; gerçek veriyi serverdan fetch ederek kullanabilirsiniz
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

  function openModal() {
    modal.setAttribute('aria-hidden','false');
    renderItems(sampleItems);
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
      .replaceAll('"','&quot;')
      .replaceAll("'", '&#39;');
  }

})();
