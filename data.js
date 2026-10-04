// MM2 VAULT — shared item data layer
(function () {
  const FALLBACK_ITEMS = [
    { id: 'travelers_axe', name: "Traveler's Axe", category: 'Unique', value: 1000, demand: 10, image: 'Travellers_Axe.png' },
    { id: 'makeshift', name: 'Makeshift', category: 'Unique', value: 800, demand: 9, image: 'Makeshift.png' },
    { id: 'chroma_luger', name: 'Chroma Luger', category: 'Chroma', value: 450, demand: 9, image: 'Chroma_Luger.png' }
  ];
  function normalizeItems(data) {
    const list = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
    const seen = new Set();
    return list.map((item, index) => {
      const raw = String(item?.id || '').trim();
      const base = raw || String(item?.name || 'item').toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || `item_${index + 1}`;
      let id = base, n = 2;
      while (seen.has(id)) id = `${base}_${n++}`;
      seen.add(id);
      return { ...item, id };
    });
  }
  async function loadItems() {
    let localItems = [];
    try {
      const response = await fetch('items.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`items.json HTTP ${response.status}`);
      localItems = normalizeItems(await response.json());
    } catch (error) {
      console.warn('[MM2 Vault] items.json unavailable:', error);
      localItems = FALLBACK_ITEMS.map(item => ({ ...item }));
    }
    if (!window.firebaseDb) return localItems;
    try {
      const snapshot = await window.firebaseDb.collection('items').get();
      const cloudItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const merged = new Map(localItems.map(item => [item.id, item]));
      cloudItems.forEach(item => merged.set(item.id, item));
      return normalizeItems([...merged.values()]);
    } catch (error) {
      console.warn('[MM2 Vault] Firestore items unavailable; using bundled data:', error);
      return localItems;
    }
  }
  window.MM2VaultData = Object.freeze({ normalizeItems, loadItems });
})();
