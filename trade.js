document.addEventListener('DOMContentLoaded', function () {
  const giveResults = document.getElementById('giveResults');
  const takeResults = document.getElementById('takeResults');

  const giveBtn = document.querySelector('button[onclick="toggleGiveList()"]');
  const takeBtn = document.querySelector('button[onclick="toggleTakeList()"]');

  function setView(container, btn, view) {
    if (!container) return;
    container.classList.toggle('list-view', view === 'list');
    container.classList.toggle('grid-view', view !== 'list');
    if (btn) btn.classList.toggle('active', view === 'list');
  }

  window.toggleGiveList = function () {
    if (!giveResults) return;
    const isList = giveResults.classList.contains('list-view');
    setView(giveResults, giveBtn, isList ? 'grid' : 'list');
  };

  window.toggleTakeList = function () {
    if (!takeResults) return;
    const isList = takeResults.classList.contains('list-view');
    setView(takeResults, takeBtn, isList ? 'grid' : 'list');
  };

  // Başlangıç görünümü (varsayılan grid)
  if (giveResults && !giveResults.classList.length) giveResults.classList.add('grid-view');
  if (takeResults && !takeResults.classList.length) takeResults.classList.add('grid-view');

  // Eğer sayfa JS ile item oluşturuyorsa, yeni item'ların doğru sınıfları alması için MutationObserver (isteğe bağlı)
  function ensureItemClassing(container) {
    if (!container) return;
    const mo = new MutationObserver(() => {
      // Her .item içine küçük resmi list/grid ile uyumlu hale getirmek için ekstra işlem gerekirse buraya ekle
      // (genelde CSS yeterlidir)
    });
    mo.observe(container, { childList: true, subtree: true });
  }
  ensureItemClassing(giveResults);
  ensureItemClassing(takeResults);
});
