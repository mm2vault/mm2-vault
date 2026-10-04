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
    imagePreview.src = imageInput && imageInput.value.trim() ? imageInput.value.trim() : 'default.svg';
  }

  imageInput?.addEventListener('input', updatePreview);
  imagePreview?.addEventListener('error', () => {
    imagePreview.src = 'default.svg';
  });

  cancelEdit?.addEventListener('click', () => {
    window.location.reload();
  });

  if (items) {
    const observer = new MutationObserver(() => {
      const rows = items.querySelectorAll('.admin-item');
      if (itemCount) itemCount.textContent = String(rows.length);
      if (categoryCount) {
        const values = new Set(Array.from(rows).map(row => row.querySelector('.admin-item-copy span')?.textContent.split(' · ')[0]).filter(Boolean));
        categoryCount.textContent = String(values.size);
      }
    });
    observer.observe(items, { childList: true, subtree: true });
  }

  form?.addEventListener('input', () => {
    if (formTitle && imageInput && imageInput.value.trim()) formTitle.dataset.ready = 'true';
  });
})();
