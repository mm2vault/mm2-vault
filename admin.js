const loginPanel = document.getElementById('loginPanel');
const adminPanel = document.getElementById('adminPanel');
const authMessage = document.getElementById('authMessage');
const formMessage = document.getElementById('formMessage');
const itemForm = document.getElementById('itemForm');
const adminItems = document.getElementById('adminItems');
const seedItemsButton = document.getElementById('seedItems');
const adminSearch = document.getElementById('adminSearch');
const adminCategory = document.getElementById('adminCategory');
let editingItemId = null;
let adminItemCache = [];

function setMessage(element, message, type = '') {
  element.textContent = message;
  element.className = `admin-message ${type}`;
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function renderAdminItems(snapshot) {
  adminItemCache = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  if (snapshot.empty) {
    adminItems.innerHTML = '<p class="admin-muted">Hələ cloud itemi yoxdur.</p>';
    return;
  }
  const search = adminSearch?.value.toLowerCase().trim() || '';
  const category = adminCategory?.value || 'all';
  const visibleItems = adminItemCache.filter(item => item.name.toLowerCase().includes(search) && (category === 'all' || item.category === category));
  adminItems.innerHTML = visibleItems.map(item => {
    return `<article class="admin-item"><img src="${item.image || 'default.png'}" alt="${item.name}" onerror="this.src='default.png'"><div><strong>${item.name}</strong><span>${item.category} · ${item.value} value · ${item.year}</span></div><div class="admin-actions"><button class="edit-item" data-id="${item.id}">Düzəlt</button><button class="delete-item" data-id="${item.id}">Sil</button></div></article>`;
  }).join('');
  adminItems.querySelectorAll('.delete-item').forEach(button => button.addEventListener('click', async () => {
    if (!window.confirm('Bu item silinsin?')) return;
    try {
      await firebaseDb.collection('items').doc(button.dataset.id).delete();
      setMessage(formMessage, 'Item silindi.', 'success');
      loadAdminItems();
    } catch (error) {
      setMessage(formMessage, 'Silinmədi. Firestore rules və bağlantını yoxla.', 'error');
    }
  }));
  adminItems.querySelectorAll('.edit-item').forEach(button => button.addEventListener('click', async () => {
    const snapshot = await firebaseDb.collection('items').doc(button.dataset.id).get();
    if (!snapshot.exists) return;
    const item = snapshot.data();
    editingItemId = snapshot.id;
    Object.entries(item).forEach(([key, value]) => {
      if (itemForm.elements[key]) itemForm.elements[key].value = value || '';
    });
    document.querySelector('#itemForm button[type="submit"]').textContent = '💾 Dəyişiklikləri saxla';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
}

function loadAdminItems() {
  return firebaseDb.collection('items').orderBy('name').get().then(renderAdminItems).catch(() => {
    adminItems.innerHTML = '<p class="admin-muted">Itemlər yüklənmədi. Firestore kolleksiyası və rules qurulmalıdır.</p>';
  });
}

function renderAiResults(result) {
  const container = document.getElementById('aiResults');
  if (!result.updates?.length) {
    container.innerHTML = '<p class="admin-muted">Uyğun dəyişiklik tapılmadı.</p>';
    return;
  }
  container.innerHTML = result.updates.map(update => {
    const directionClass = update.direction === 'up' ? 'ai-up' : update.direction === 'down' ? 'ai-down' : 'ai-same';
    const icon = update.direction === 'up' ? '↑' : update.direction === 'down' ? '↓' : '→';
    return `<article class="ai-result"><div><strong>${icon} ${update.name}</strong><small>${update.oldValue} → ${update.newValue} (${update.change > 0 ? '+' : ''}${update.change}) · ${update.confidence} confidence</small><small>${update.reason || ''}</small></div><button class="admin-button apply-ai" data-update="${encodeURIComponent(JSON.stringify(update))}">Tətbiq et</button></article>`;
  }).join('');
  container.querySelectorAll('.apply-ai').forEach(button => button.addEventListener('click', async () => {
    const update = JSON.parse(decodeURIComponent(button.dataset.update));
    if (!adminItemCache.some(item => item.id === update.id)) return;
    try {
      const item = adminItemCache.find(entry => entry.id === update.id);
      const history = Array.isArray(item.valueHistory) ? item.valueHistory : [{ value: Number(item.value), changedAt: null, source: 'initial' }];
      history.push({ value: Number(update.newValue), changedAt: new Date().toISOString(), source: 'MM2Values + Gemini' });
      await firebaseDb.collection('items').doc(update.id).update({ value: Number(update.newValue), previousValue: Number(update.oldValue), valueChange: Number(update.change), valueSource: 'MM2Values + Gemini', valueUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(), valueHistory: history.slice(-30) });
      button.textContent = '✓ Saxlandı';
      button.disabled = true;
      setMessage(formMessage, `${update.name} dəyəri yeniləndi.`, 'success');
      loadAdminItems();
    } catch (error) { setMessage(formMessage, `Dəyişiklik saxlanmadı: ${error.message}`, 'error'); }
  }));
}

async function seedJsonItems() {
  const response = await fetch('items.json');
  const sourceItems = await response.json();
  const usedIds = new Set();
  const batch = firebaseDb.batch();
  sourceItems.forEach((item, index) => {
    const baseId = item.id || item.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const id = usedIds.has(baseId) ? `${baseId}_${index + 1}` : baseId;
    usedIds.add(id);
    batch.set(firebaseDb.collection('items').doc(id), { ...item, id });
  });
  await batch.commit();
  setMessage(formMessage, `${sourceItems.length} item cloud-a köçürüldü.`, 'success');
  loadAdminItems();
}

firebaseAuth.onAuthStateChanged(user => {
  if (!user) {
    loginPanel.classList.remove('hidden');
    adminPanel.classList.add('hidden');
    return;
  }
  if (!isMm2Admin(user)) {
    setMessage(authMessage, `Bu hesab admin deyil: ${user.email}`, 'error');
    firebaseAuth.signOut();
    return;
  }
  loginPanel.classList.add('hidden');
  adminPanel.classList.remove('hidden');
  document.getElementById('adminIdentity').textContent = `${user.email} hesabı ilə daxil oldun.`;
  loadAdminItems();
});

document.getElementById('logoutButton').addEventListener('click', () => firebaseAuth.signOut());
document.getElementById('analyzeAi').addEventListener('click', async () => {
  const button = document.getElementById('analyzeAi');
  const sourceText = document.getElementById('aiSourceText').value;
  button.disabled = true;
  button.textContent = '⏳ Analiz edilir...';
  try { renderAiResults(await analyzeValueChanges(sourceText, adminItemCache)); }
  catch (error) { setMessage(formMessage, error.message, 'error'); }
  finally { button.disabled = false; button.textContent = '🤖 Dəyərləri analiz et'; }
});
seedItemsButton.addEventListener('click', async () => {
  if (!window.confirm('Mövcud 101 item Firestore-a köçürülsün?')) return;
  try { await seedJsonItems(); } catch (error) { setMessage(formMessage, `Köçürmə alınmadı: ${error.message}`, 'error'); }
});
adminSearch?.addEventListener('input', () => firebaseDb.collection('items').orderBy('name').get().then(renderAdminItems));
adminCategory?.addEventListener('change', () => firebaseDb.collection('items').orderBy('name').get().then(renderAdminItems));

itemForm.addEventListener('submit', async event => {
  event.preventDefault();
  const user = firebaseAuth.currentUser;
  if (!user || !isMm2Admin(user)) return;
  const values = Object.fromEntries(new FormData(itemForm));
  const item = {
    id: slugify(values.name), name: values.name.trim(), category: values.category,
    type: values.type.trim(), value: Number(values.value), demand: Number(values.demand),
    year: Number(values.year), image: values.image.trim(), description: values.description.trim(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(), createdBy: user.email
  };
  try {
    const wasEditing = Boolean(editingItemId);
    const documentId = editingItemId || item.id;
    const oldSnapshot = await firebaseDb.collection('items').doc(documentId).get();
    const oldItem = oldSnapshot.data() || {};
    const history = Array.isArray(oldItem.valueHistory) ? oldItem.valueHistory : [{ value: Number(oldItem.value ?? item.value), changedAt: null, source: 'initial' }];
    if (oldSnapshot.exists && Number(oldItem.value) !== item.value) history.push({ value: item.value, changedAt: new Date().toISOString(), source: 'admin' });
    await firebaseDb.collection('items').doc(documentId).set({ ...item, id: documentId, valueHistory: history.slice(-30) }, { merge: true });
    itemForm.reset();
    editingItemId = null;
    document.querySelector('#itemForm button[type="submit"]').textContent = '➕ Item əlavə et';
    setMessage(formMessage, wasEditing ? 'Item yeniləndi.' : 'Item uğurla əlavə edildi.', 'success');
    loadAdminItems();
  } catch (error) {
    setMessage(formMessage, `Item əlavə edilmədi: ${error.message}`, 'error');
  }
});
