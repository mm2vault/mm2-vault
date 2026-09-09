const MM2_TRANSLATIONS = {
  az: { home: 'Ana Səhifə', trade: 'Trade', favorites: 'Favorilər', admin: 'Admin', language: 'Dil', search: 'Item ara...', back: 'Geri Dön', login: 'Google ilə giriş', logout: 'Çıxış', discord: 'Discorda qoşul', tiktok: 'TikTok', youtube: 'YouTube', categories: 'Bütün Kateqoriyalar', sort: 'Sırala', top: 'Ən Dəyərli Itemlər', give: 'Sən Verirsən', take: 'Qarşı Tərəf', detail: 'Item Detay', adminLogin: 'Admin girişi' },
  tr: { home: 'Ana Sayfa', trade: 'Trade', favorites: 'Favoriler', admin: 'Admin', language: 'Dil', search: 'Eşya ara...', back: 'Geri Dön', login: 'Google ile giriş', logout: 'Çıkış', discord: 'Discorda katıl', tiktok: 'TikTok', youtube: 'YouTube', categories: 'Tüm Kategoriler', sort: 'Sırala', top: 'En Değerli Eşyalar', give: 'Sen Veriyorsun', take: 'Karşı Taraf', detail: 'Eşya Detayı', adminLogin: 'Admin girişi' },
  en: { home: 'Home', trade: 'Trade', favorites: 'Favorites', admin: 'Admin', language: 'Language', search: 'Search item...', back: 'Back', login: 'Sign in with Google', logout: 'Sign out', discord: 'Join Discord', tiktok: 'TikTok', youtube: 'YouTube', categories: 'All Categories', sort: 'Sort', top: 'Most Valuable Items', give: 'You Give', take: 'Other Side', detail: 'Item Details', adminLogin: 'Admin login' }
};

const MM2_STATIC_TRANSLATIONS = {
  'az': {
    'Trade Values & Item Archive': 'Trade Dəyərləri və Item Arxivi', 'MM2 Vault yüklənir...': 'MM2 Vault yüklənir...', 'Favorites': 'Favorilər', 'Favorites': 'Favorilər', 'Favori': 'Favori', 'Favorilər': 'Favorilər', 'Seçdiyin MM2 itemləri': 'Seçdiyin MM2 itemləri', 'Detay yüklənir...': 'Detay yüklənir...', 'Trade yüklənir...': 'Trade yüklənir...', 'Trade dəyərini hesabla': 'Trade dəyərini hesabla', 'Item Detay': 'Item Detay', 'Əşya haqqında tam məlumat': 'Əşya haqqında tam məlumat', 'Geri Dön': 'Geri Dön', 'Bütün Kateqoriyalar': 'Bütün Kateqoriyalar', 'Sırala': 'Sırala', 'Dəyər (Yüksək → Aşağı)': 'Dəyər (Yüksək → Aşağı)', 'Dəyər (Aşağı → Yüksək)': 'Dəyər (Aşağı → Yüksək)', 'Tələb': 'Tələb', 'Sən Verirsən': 'Sən Verirsən', 'Qarşı Tərəf': 'Qarşı Tərəf', 'Liste': 'Siyahı', 'Seçilənlər': 'Seçilənlər', 'Dəyər:': 'Dəyər:', 'Trade gözləyir...': 'Trade gözləyir...', 'Trade tarixçəsi': 'Trade tarixçəsi', 'Təmizlə': 'Təmizlə', 'Trade-i yadda saxla': 'Trade-i yadda saxla', 'Admin yüklənir...': 'Admin yüklənir...', 'Item idarəetmə paneli': 'Item idarəetmə paneli', 'Admin girişi': 'Admin girişi', 'Yalnız təsdiqlənmiş Google hesabı ilə daxil ola bilərsiniz.': 'Yalnız təsdiqlənmiş Google hesabı ilə daxil ola bilərsiniz.', 'Yeni item əlavə et': 'Yeni item əlavə et', 'Düzəlt': 'Düzəlt', 'Sil': 'Sil', 'Bütün itemlər': 'Bütün itemlər', 'Bütün kateqoriyalar': 'Bütün kateqoriyalar', 'AI dəyər köməkçisi': 'AI dəyər köməkçisi', 'Dəyərləri analiz et': 'Dəyərləri analiz et', 'MM2Values dəyişikliklərini aç': 'MM2Values dəyişikliklərini aç', '📦 Mövcud itemləri cloud-a köçür': '📦 Mövcud itemləri cloud-a köçür', 'Dəyər tarixçəsi': 'Dəyər tarixçəsi', 'Hələ item yoxdur': 'Hələ item yoxdur', 'Hələ favori yoxdur': 'Hələ favori yoxdur', 'Heç bir item tapılmadı': 'Heç bir item tapılmadı', '© 2026 MM2 Vault • Made for Roblox Players': '© 2026 MM2 Vault • Roblox oyunçuları üçün'
  },
  'tr': {
    'Trade Values & Item Archive': 'Trade Değerleri ve Eşya Arşivi', 'MM2 Vault yüklənir...': 'MM2 Vault yükleniyor...', 'Favorites': 'Favoriler', 'Favori': 'Favori', 'Favorilər': 'Favoriler', 'Seçdiyin MM2 itemləri': 'Seçtiğin MM2 eşyaları', 'Detay yüklənir...': 'Detay yükleniyor...', 'Trade yüklənir...': 'Trade yükleniyor...', 'Trade dəyərini hesabla': 'Trade değerini hesapla', 'Item Detay': 'Eşya Detayı', 'Əşya haqqında tam məlumat': 'Eşya hakkında tüm bilgiler', 'Geri Dön': 'Geri Dön', 'Bütün Kateqoriyalar': 'Tüm Kategoriler', 'Sırala': 'Sırala', 'Dəyər (Yüksək → Aşağı)': 'Değer (Yüksek → Düşük)', 'Dəyər (Aşağı → Yüksək)': 'Değer (Düşük → Yüksek)', 'Tələb': 'Talep', 'Sən Verirsən': 'Sen Veriyorsun', 'Qarşı Tərəf': 'Karşı Taraf', 'Liste': 'Liste', 'Seçilənlər': 'Seçilenler', 'Dəyər:': 'Değer:', 'Trade gözləyir...': 'Trade bekleniyor...', 'Trade tarixçəsi': 'Trade geçmişi', 'Təmizlə': 'Temizle', 'Trade-i yadda saxla': 'Trade kaydet', 'Admin yüklənir...': 'Admin yükleniyor...', 'Item idarəetmə paneli': 'Eşya yönetim paneli', 'Admin girişi': 'Admin girişi', 'Yalnız təsdiqlənmiş Google hesabı ilə daxil ola bilərsiniz.': 'Yalnız onaylı Google hesabıyla giriş yapabilirsiniz.', 'Yeni item əlavə et': 'Yeni eşya ekle', 'Düzəlt': 'Düzenle', 'Sil': 'Sil', 'Bütün itemlər': 'Tüm eşyalar', 'Bütün kateqoriyalar': 'Tüm kategoriler', 'AI dəyər köməkçisi': 'AI değer yardımcısı', 'Dəyərləri analiz et': 'Değerleri analiz et', 'MM2Values dəyişikliklərini aç': 'MM2Values değişikliklerini aç', '📦 Mövcud itemləri cloud-a köçür': '📦 Mevcut eşyaları cloud’a aktar', 'Dəyər tarixçəsi': 'Değer geçmişi', 'Hələ item yoxdur': 'Henüz eşya yok', 'Hələ favori yoxdur': 'Henüz favori yok', 'Heç bir item tapılmadı': 'Eşya bulunamadı', '© 2026 MM2 Vault • Made for Roblox Players': '© 2026 MM2 Vault • Roblox oyuncuları için'
  },
  'en': {
    'Trade Values & Item Archive': 'Trade Values & Item Archive', 'MM2 Vault yüklənir...': 'MM2 Vault loading...', 'Favorites': 'Favorites', 'Favori': 'Favorite', 'Favorilər': 'Favorites', 'Seçdiyin MM2 itemləri': 'Your MM2 items', 'Detay yüklənir...': 'Loading details...', 'Trade yüklənir...': 'Loading trade...', 'Trade dəyərini hesabla': 'Calculate trade value', 'Item Detay': 'Item Details', 'Əşya haqqında tam məlumat': 'Complete item information', 'Geri Dön': 'Back', 'Bütün Kateqoriyalar': 'All Categories', 'Sırala': 'Sort', 'Dəyər (Yüksək → Aşağı)': 'Value (High → Low)', 'Dəyər (Aşağı → Yüksək)': 'Value (Low → High)', 'Tələb': 'Demand', 'Sən Verirsən': 'You Give', 'Qarşı Tərəf': 'Other Side', 'Liste': 'List', 'Seçilənlər': 'Selected', 'Dəyər:': 'Value:', 'Trade gözləyir...': 'Waiting for trade...', 'Trade tarixçəsi': 'Trade history', 'Təmizlə': 'Clear', 'Trade-i yadda saxla': 'Save trade', 'Admin yüklənir...': 'Loading admin...', 'Item idarəetmə paneli': 'Item management panel', 'Admin girişi': 'Admin login', 'Yalnız təsdiqlənmiş Google hesabı ilə daxil ola bilərsiniz.': 'Only approved Google accounts can sign in.', 'Yeni item əlavə et': 'Add new item', 'Düzəlt': 'Edit', 'Sil': 'Delete', 'Bütün itemlər': 'All items', 'Bütün kateqoriyalar': 'All categories', 'AI dəyər köməkçisi': 'AI value assistant', 'Dəyərləri analiz et': 'Analyze values', 'MM2Values dəyişikliklərini aç': 'Open MM2Values changes', '📦 Mövcud itemləri cloud-a köçür': '📦 Move existing items to cloud', 'Dəyər tarixçəsi': 'Value history', 'Hələ item yoxdur': 'No items yet', 'Hələ favori yoxdur': 'No favorites yet', 'Heç bir item tapılmadı': 'No items found', '© 2026 MM2 Vault • Made for Roblox Players': '© 2026 MM2 Vault • For Roblox players'
  }
};

function applyLanguage(language) {
  const text = MM2_TRANSLATIONS[language] || MM2_TRANSLATIONS.az;
  const staticText = MM2_STATIC_TRANSLATIONS[language] || MM2_STATIC_TRANSLATIONS.az;
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (text[key]) element.textContent = text[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.dataset.i18nPlaceholder;
    if (text[key]) element.placeholder = text[key];
  });
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.dataset.i18nTitle;
    if (text[key]) element.title = text[key];
  });
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const allStatic = Object.values(MM2_STATIC_TRANSLATIONS);
  nodes.forEach(node => {
    const parent = node.parentElement;
    const value = node.nodeValue.trim();
    if (!value || ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent?.tagName)) return;
    const sourceKey = Object.keys(staticText).find(key => key === value || allStatic.some(dictionary => dictionary[key] === value));
    if (sourceKey && staticText[sourceKey]) node.nodeValue = node.nodeValue.replace(value, staticText[sourceKey]);
  });
  document.title = language === 'en' ? 'MM2 Vault - Trade Values' : language === 'tr' ? 'MM2 Vault - Trade Değerleri' : 'MM2 Vault - Trade Dəyərləri';
  localStorage.setItem('mm2_language', language);
}

function installLanguagePicker() {
  const header = document.querySelector('header');
  if (!header || header.querySelector('.language-picker')) return;
  const picker = document.createElement('label');
  picker.className = 'language-picker';
  picker.innerHTML = `<span>🌐</span><select aria-label="Language"><option value="az">AZ</option><option value="tr">TR</option><option value="en">EN</option></select>`;
  header.appendChild(picker);
  const select = picker.querySelector('select');
  select.value = localStorage.getItem('mm2_language') || 'az';
  select.addEventListener('change', event => applyLanguage(event.target.value));
  applyLanguage(select.value);
}

document.addEventListener('DOMContentLoaded', installLanguagePicker);
