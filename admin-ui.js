(function () {
  const form = document.getElementById('itemForm');
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');
  const cancelEdit = document.getElementById('cancelEdit');
  const formTitle = document.getElementById('formTitle');
  const itemCount = document.getElementById('adminItemCount');
  const categoryCount = document.getElementById('adminCategoryCount');
  const items = document.getElementById('adminItems');

  function updatePreview() {
    if (!imagePreview) return;
    const value = imageInput?.value.trim();
    imagePreview.src = value || 'default.svg';
  }

  function updateStats() {
    if (!items) return;
    const rows = [...items.querySelectorAll('.admin-item')];
    if (itemCount) itemCount.textContent = String(rows.length);
    if (categoryCount) {
      const categories = new Set(
        rows.map(row => {
          const meta = row.querySelector('div > span');
          return meta?.textContent.split(' · ')[0].trim();
        }).filter(Boolean)
      );
      categoryCount.textContent = String(categories.size);
    }
  }

  function setEditMode(active) {
    if (formTitle) formTitle.textContent = active ? 'Itemi redaktə et' : 'Yeni item';
    cancelEdit?.classList.toggle('hidden', !active);
  }

  imageInput?.addEventListener('input', updatePreview);
  imagePreview?.addEventListener('error', () => {
    imagePreview.src = 'default.svg';
  });

  items?.addEventListener('click', event => {
    const editButton = event.target.closest('.edit-item');
    if (editButton) setEditMode(true);
  }, true);

  cancelEdit?.addEventListener('click', () => {
    setEditMode(false);
    form?.reset();
    updatePreview();
    const submit = form?.querySelector('button[type="submit"]');
    if (submit) submit.innerHTML = '➕ <span>Item əlavə et</span>';
  });

  if (items) {
    const observer = new MutationObserver(updateStats);
    observer.observe(items, { childList: true, subtree: true });
    updateStats();
  }

  form?.addEventListener('input', updatePreview);
})();
