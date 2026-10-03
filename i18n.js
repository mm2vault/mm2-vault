const MM2_LANGUAGES={az:{name:'Azərbaycan dili',short:'AZ'},tr:{name:'Türkçe',short:'TR'},en:{name:'English',short:'EN'},ru:{name:'Русский',short:'RU'}};

const T={
az:{
home:'Ana Səhifə',trade:'Trade',favorites:'Favorilər',admin:'Admin',language:'Dil',search:'Item axtar...',back:'Geri qayıt',login:'Google ilə giriş',logout:'Çıxış',discord:'Discorda qoşul',tiktok:'TikTok',youtube:'YouTube',
categories:'Bütün kateqoriyalar',sort:'Sırala',all:'Bütün itemlər',top:'Ən dəyərli itemlər',market:'Bazar',trending:'İndi nə trenddədir?',live:'Market aktivdir',pulse:'MARKET PULSE',pulseText:'Dəyər dəyişiklikləri izlənir',
value:'Dəyər',demand:'Tələb',favoritesCount:'Favorilər',liveValues:'Canlı dəyərlər',checkValues:'Dəyərləri tez yoxla',popular:'Populyar itemləri gör',saveFavorites:'Sevdiklərini saxla',
tradeCalc:'Trade Kalkulyatoru',discover:'Itemləri kəşf et',madeFor:'Roblox oyunçuları üçün',detail:'Item Detayı',details:'Item haqqında tam məlumat',waiting:'Trade gözləyir...',selected:'Seçilənlər',clear:'Təmizlə',saveTrade:'Trade-i yadda saxla',history:'Trade tarixçəsi',give:'🔴 Sən Verirsən',take:'🟢 Qarşı Tərəf',
win:'WIN',fair:'FAIR',lose:'LOSE',noFav:'Hələ favori yoxdur',noFavText:'Itemləri ana səhifədən favorilərə əlavə edə bilərsiniz.',homeBack:'Ana səhifəyə qayıt',
adminLogin:'Admin girişi',adminOnly:'Yalnız təsdiqlənmiş Google hesabı ilə daxil ola bilərsiniz.',addItem:'Yeni item əlavə et',edit:'Düzəlt',delete:'Sil',allItems:'Bütün itemlər',allCategories:'Bütün kateqoriyalar',ai:'AI dəyər köməkçisi',analyze:'Dəyərləri analiz et',seed:'Mövcud itemləri cloud-a köçür',adminSearch:'Admin item axtar...',
loading:'Yüklənir...',loadingDetails:'Detay yüklənir...',loadingTrade:'Trade yüklənir...',loadingAdmin:'Admin yüklənir...',notFound:'Item tapılmadı',noItems:'Heç bir item tapılmadı',clearHistory:'Tarixçəni təmizlə',valueHigh:'Dəyər: yüksək → aşağı',valueLow:'Dəyər: aşağı → yüksək',demandSort:'Tələb',azSort:'A → Z',zaSort:'Z → A',
title:'MM2 Vault — Trade Dəyərləri',hero:'Trade dəyərini bir baxışda tap.',heroText:'MM2 itemlərini axtar, dəyərini yoxla, demand-ı müqayisə et və trade qərarını daha rahat ver.'
},
tr:{
home:'Ana Sayfa',trade:'Trade',favorites:'Favoriler',admin:'Admin',language:'Dil',search:'Eşya ara...',back:'Geri dön',login:'Google ile giriş',logout:'Çıkış',discord:'Discorda katıl',tiktok:'TikTok',youtube:'YouTube',
categories:'Tüm kategoriler',sort:'Sırala',all:'Tüm eşyalar',top:'En değerli eşyalar',market:'Pazar',trending:'Şimdi neler trend?',live:'Pazar aktif',pulse:'PAZAR NABZI',pulseText:'Değer değişiklikleri izleniyor',
value:'Değer',demand:'Talep',favoritesCount:'Favoriler',liveValues:'Canlı değerler',checkValues:'Değerleri hızlıca kontrol et',popular:'Popüler eşyaları gör',saveFavorites:'Sevdiklerini kaydet',
tradeCalc:'Trade Hesaplayıcı',discover:'Eşyaları keşfet',madeFor:'Roblox oyuncuları için',detail:'Eşya Detayı',details:'Eşya hakkında tüm bilgiler',waiting:'Trade bekleniyor...',selected:'Seçilenler',clear:'Temizle',saveTrade:'Trade kaydet',history:'Trade geçmişi',give:'🔴 Sen Veriyorsun',take:'🟢 Karşı Taraf',
win:'WIN',fair:'FAIR',lose:'LOSE',noFav:'Henüz favori yok',noFavText:'Eşyaları ana sayfadan favorilere ekleyebilirsin.',homeBack:'Ana sayfaya dön',
adminLogin:'Admin girişi',adminOnly:'Yalnızca onaylı Google hesabıyla giriş yapabilirsiniz.',addItem:'Yeni eşya ekle',edit:'Düzenle',delete:'Sil',allItems:'Tüm eşyalar',allCategories:'Tüm kategoriler',ai:'AI değer yardımcısı',analyze:'Değerleri analiz et',seed:'Mevcut eşyaları cloud’a aktar',adminSearch:'Admin eşya ara...',
loading:'Yükleniyor...',loadingDetails:'Detay yükleniyor...',loadingTrade:'Trade yükleniyor...',loadingAdmin:'Admin yükleniyor...',notFound:'Eşya bulunamadı',noItems:'Hiç eşya bulunamadı',clearHistory:'Geçmişi temizle',valueHigh:'Değer: yüksek → düşük',valueLow:'Değer: düşük → yüksek',demandSort:'Talep',azSort:'A → Z',zaSort:'Z → A',
title:'MM2 Vault — Trade Değerleri',hero:'Trade değerini bir bakışta bul.',heroText:'MM2 eşyalarını ara, değerini kontrol et, talebi karşılaştır ve trade kararını daha kolay ver.'
},
en:{
home:'Home',trade:'Trade',favorites:'Favorites',admin:'Admin',language:'Language',search:'Search item...',back:'Back',login:'Sign in with Google',logout:'Sign out',discord:'Join Discord',tiktok:'TikTok',youtube:'YouTube',
categories:'All categories',sort:'Sort',all:'All items',top:'Top items',market:'Market',trending:"What's trending?",live:'Market live',pulse:'MARKET PULSE',pulseText:'Tracking value changes',
value:'Value',demand:'Demand',favoritesCount:'Favorites',liveValues:'Live values',checkValues:'Check values quickly',popular:'See popular items',saveFavorites:'Save favorites',
tradeCalc:'Trade Calculator',discover:'Discover items',madeFor:'Made for Roblox players',detail:'Item Details',details:'Complete item information',waiting:'Waiting for trade...',selected:'Selected',clear:'Clear',saveTrade:'Save trade',history:'Trade history',give:'🔴 You Give',take:'🟢 Other Side',
win:'WIN',fair:'FAIR',lose:'LOSE',noFav:'No favorites yet',noFavText:'Add items to favorites from the home page.',homeBack:'Back to home',
adminLogin:'Admin login',adminOnly:'Only approved Google accounts can sign in.',addItem:'Add new item',edit:'Edit',delete:'Delete',allItems:'All items',allCategories:'All categories',ai:'AI value assistant',analyze:'Analyze values',seed:'Move existing items to cloud',adminSearch:'Search admin items...',
loading:'Loading...',loadingDetails:'Loading details...',loadingTrade:'Loading trade...',loadingAdmin:'Loading admin...',notFound:'Item not found',noItems:'No items found',clearHistory:'Clear history',valueHigh:'Value: high → low',valueLow:'Value: low → high',demandSort:'Demand',azSort:'A → Z',zaSort:'Z → A',
title:'MM2 Vault — Trade Values',hero:'Find trade value at a glance.',heroText:'Search MM2 items, check values, compare demand and make trade decisions more easily.'
},
ru:{
home:'Главная',trade:'Трейд',favorites:'Избранное',admin:'Админ',language:'Язык',search:'Поиск предмета...',back:'Назад',login:'Войти через Google',logout:'Выйти',discord:'Войти в Discord',tiktok:'TikTok',youtube:'YouTube',
categories:'Все категории',sort:'Сортировка',all:'Все предметы',top:'Самые ценные предметы',market:'Рынок',trending:'Что сейчас в тренде?',live:'Рынок активен',pulse:'ОБЗОР РЫНКА',pulseText:'Отслеживаем изменения цен',
value:'Цена',demand:'Спрос',favoritesCount:'Избранное',liveValues:'Актуальные цены',checkValues:'Быстрая проверка цен',popular:'Популярные предметы',saveFavorites:'Сохраняйте любимое',
tradeCalc:'Калькулятор трейда',discover:'Исследовать предметы',madeFor:'Для игроков Roblox',detail:'Детали предмета',details:'Полная информация о предмете',waiting:'Ожидание трейда...',selected:'Выбрано',clear:'Очистить',saveTrade:'Сохранить трейд',history:'История трейдов',give:'🔴 Вы отдаёте',take:'🟢 Другая сторона',
win:'ВЫИГРЫШ',fair:'РАВНО',lose:'ПРОИГРЫШ',noFav:'Избранного пока нет',noFavText:'Добавьте предметы в избранное на главной странице.',homeBack:'На главную',
adminLogin:'Вход администратора',adminOnly:'Войти могут только одобренные аккаунты Google.',addItem:'Добавить предмет',edit:'Изменить',delete:'Удалить',allItems:'Все предметы',allCategories:'Все категории',ai:'AI-помощник цен',analyze:'Анализировать цены',seed:'Перенести предметы в облако',adminSearch:'Поиск предметов в админке...',
loading:'Загрузка...',loadingDetails:'Загрузка деталей...',loadingTrade:'Загрузка трейда...',loadingAdmin:'Загрузка админки...',notFound:'Предмет не найден',noItems:'Предметы не найдены',clearHistory:'Очистить историю',valueHigh:'Цена: по убыванию',valueLow:'Цена: по возрастанию',demandSort:'Спрос',azSort:'А → Я',zaSort:'Я → А',
title:'MM2 Vault — Ценности трейда',hero:'Узнай ценность трейда с первого взгляда.',heroText:'Ищите предметы MM2, проверяйте цены, сравнивайте спрос и принимайте решения по трейду проще.'
}};

function lang(){const v=localStorage.getItem('mm2_language');return MM2_LANGUAGES[v]?v:'az'}
function tr(key){const l=lang();return (T[l]&&T[l][key])??T.az[key]??key}
window.mm2t=tr;window.mm2Language=lang;

const PHRASES={
'az':{'TRADE VALUES':'TRADE DƏYƏRLƏRİ','LIVE MARKET DATA':'CANLI BAZAR MƏLUMATLARI','MARKET':'BAZAR','MARKET PULSE':'BAZAR NABZI','TOP PICKS':'ƏN YAXŞI SEÇİMLƏR','ARCHIVE':'ARXİV','Live Values':'Canlı dəyərlər','Demand':'Tələb','Favorites':'Favorilər','Dəyərləri tez yoxla':'Dəyərləri tez yoxla','Populyar itemləri gör':'Populyar itemləri gör','Sevdiklərini saxla':'Sevdiklərini saxla','Made for Roblox Players':'Roblox oyunçuları üçün','Made for Roblox players':'Roblox oyunçuları üçün','Detay yüklənir...':'Detay yüklənir...','Trade yüklənir...':'Trade yüklənir...','Yüklənir...':'Yüklənir...'},
'tr':{'TRADE VALUES':'TRADE DEĞERLERİ','LIVE MARKET DATA':'CANLI PAZAR VERİLERİ','MARKET':'PAZAR','MARKET PULSE':'PAZAR NABZI','TOP PICKS':'ÖNE ÇIKANLAR','ARCHIVE':'ARŞİV','Live Values':'Canlı değerler','Demand':'Talep','Favorites':'Favoriler','Dəyərləri tez yoxla':'Değerleri hızlıca kontrol et','Populyar itemləri gör':'Popüler eşyaları gör','Sevdiklərini saxla':'Sevdiklerini kaydet','Made for Roblox Players':'Roblox oyuncuları için','Made for Roblox players':'Roblox oyuncuları için','Detay yüklənir...':'Detay yükleniyor...','Trade yüklənir...':'Trade yükleniyor...','Yüklənir...':'Yükleniyor...'},
'en':{'TRADE VALUES':'TRADE VALUES','LIVE MARKET DATA':'LIVE MARKET DATA','MARKET':'MARKET','MARKET PULSE':'MARKET PULSE','TOP PICKS':'TOP PICKS','ARCHIVE':'ARCHIVE','Live Values':'Live Values','Demand':'Demand','Favorites':'Favorites','Dəyərləri tez yoxla':'Check values quickly','Populyar itemləri gör':'See popular items','Sevdiklərini saxla':'Save favorites','Made for Roblox Players':'Made for Roblox players','Made for Roblox players':'Made for Roblox players','Detay yüklənir...':'Loading details...','Trade yüklənir...':'Loading trade...','Yüklənir...':'Loading...'},
'ru':{'TRADE VALUES':'ЦЕННОСТИ ТРЕЙДА','LIVE MARKET DATA':'АКТУАЛЬНЫЕ ДАННЫЕ РЫНКА','MARKET':'РЫНОК','MARKET PULSE':'ОБЗОР РЫНКА','TOP PICKS':'ЛУЧШИЕ ПРЕДМЕТЫ','ARCHIVE':'АРХИВ','Live Values':'Актуальные цены','Demand':'Спрос','Favorites':'Избранное','Dəyərləri tez yoxla':'Быстрая проверка цен','Populyar itemləri gör':'Популярные предметы','Sevdiklərini saxla':'Сохраняйте любимое','Made for Roblox Players':'Для игроков Roblox','Made for Roblox players':'Для игроков Roblox','Detay yüklənir...':'Загрузка деталей...','Trade yüklənir...':'Загрузка трейда...','Yüklənir...':'Загрузка...'}
};

for(const l of Object.keys(PHRASES)){Object.assign(PHRASES[l],{
'Yeni dəyər dəyişiklikləri burada görünəcək':l==='az'?'Yeni dəyər dəyişiklikləri burada görünəcək':l==='tr'?'Yeni değer değişiklikleri burada görünecek':l==='en'?'New value changes will appear here':'Здесь появятся новые изменения цен',
'items.json tapılmadı':l==='az'?'items.json tapılmadı':l==='tr'?'items.json bulunamadı':l==='en'?'items.json not found':'items.json не найден',
'Cloud itemləri yüklənmədi, JSON istifadə olunur:':l==='az'?'Cloud itemləri yüklənmədi, JSON istifadə olunur:':l==='tr'?'Cloud eşyaları yüklenemedi, JSON kullanılıyor:':l==='en'?'Cloud items could not be loaded, using JSON:':'Не удалось загрузить предметы из облака, используется JSON:',
'items.json yüklənmədi, fallback məlumatlar istifadə olunur:':l==='az'?'items.json yüklənmədi, fallback məlumatlar istifadə olunur:':l==='tr'?'items.json yüklenemedi, yedek veriler kullanılıyor:':l==='en'?'items.json could not be loaded, using fallback data:':'items.json не удалось загрузить, используются резервные данные:',
'items.json yüklənmədi, fallback istifadə olunur:':l==='az'?'items.json yüklənmədi, fallback istifadə olunur:':l==='tr'?'items.json yüklenemedi, yedek kullanılıyor:':l==='en'?'items.json could not be loaded, using fallback:':'items.json не удалось загрузить, используется резервный вариант:',
'Item tapılmadı':l==='az'?'Item tapılmadı':l==='tr'?'Eşya bulunamadı':l==='en'?'Item not found':'Предмет не найден',
'Bu ID ilə heç bir item yoxdur':l==='az'?'Bu ID ilə heç bir item yoxdur':l==='tr'?'Bu ID ile eşya yok':l==='en'?'No item exists with this ID':'Предмет с таким ID отсутствует',
'Heç bir nəticə tapılmadı':l==='az'?'Heç bir nəticə tapılmadı':l==='tr'?'Hiçbir sonuç bulunamadı':l==='en'?'No results found':'Результаты не найдены',
'Heç bir item seçilməyib':l==='az'?'Heç bir item seçilməyib':l==='tr'?'Hiçbir eşya seçilmedi':l==='en'?'No item selected':'Предмет не выбран',
'FAIR TRADE':l==='az'?'ƏDALƏTLİ TRADE':l==='tr'?'ADİL TRADE':l==='en'?'FAIR TRADE':'РАВНЫЙ ТРЕЙД',
'Hələ trade tarixçəsi yoxdur.':l==='az'?'Hələ trade tarixçəsi yoxdur.':l==='tr'?'Henüz trade geçmişi yok.':l==='en'?'No trade history yet.':'Истории трейдов пока нет.',
'Bütün itemlər göstərilir':l==='az'?'Bütün itemlər göstərilir':l==='tr'?'Tüm eşyalar gösteriliyor':l==='en'?'All items are shown':'Показаны все предметы',
'Hələ cloud itemi yoxdur.':l==='az'?'Hələ cloud itemi yoxdur.':l==='tr'?'Henüz cloud eşyası yok.':l==='en'?'No cloud items yet.':'Облачных предметов пока нет.',
'Bu item silinsin?':l==='az'?'Bu item silinsin?':l==='tr'?'Bu eşya silinsin mi?':l==='en'?'Delete this item?':'Удалить этот предмет?',
'Item silindi.':l==='az'?'Item silindi.':l==='tr'?'Eşya silindi.':l==='en'?'Item deleted.':'Предмет удалён.',
'Silinmədi. Firestore rules və bağlantını yoxla.':l==='az'?'Silinmədi. Firestore rules və bağlantını yoxla.':l==='tr'?'Silinemedi. Firestore kurallarını ve bağlantıyı kontrol et.':l==='en'?'Could not delete. Check Firestore rules and connection.':'Не удалось удалить. Проверьте правила Firestore и подключение.',
'💾 Dəyişiklikləri saxla':l==='az'?'💾 Dəyişiklikləri saxla':l==='tr'?'💾 Değişiklikleri kaydet':l==='en'?'💾 Save changes':'💾 Сохранить изменения',
'Itemlər yüklənmədi. Firestore kolleksiyası və rules qurulmalıdır.':l==='az'?'Itemlər yüklənmədi. Firestore kolleksiyası və rules qurulmalıdır.':l==='tr'?'Eşyalar yüklenemedi. Firestore koleksiyonu ve kurallar kurulmalı.':l==='en'?'Items could not be loaded. Firestore collection and rules are required.':'Не удалось загрузить предметы. Требуются коллекция Firestore и правила.',
'Uyğun dəyişiklik tapılmadı.':l==='az'?'Uyğun dəyişiklik tapılmadı.':l==='tr'?'Uygun değişiklik bulunamadı.':l==='en'?'No matching changes found.':'Подходящих изменений не найдено.',
'✓ Saxlandı':l==='az'?'✓ Saxlandı':l==='tr'?'✓ Kaydedildi':l==='en'?'✓ Saved':'✓ Сохранено',
'⏳ Analiz edilir...':l==='az'?'⏳ Analiz edilir...':l==='tr'?'⏳ Analiz ediliyor...':l==='en'?'⏳ Analyzing...':'⏳ Анализ...',
'🤖 Dəyərləri analiz et':l==='az'?'🤖 Dəyərləri analiz et':l==='tr'?'🤖 Değerleri analiz et':l==='en'?'🤖 Analyze values':'🤖 Анализировать цены',
'Mövcud 101 item Firestore-a köçürülsün?':l==='az'?'Mövcud 101 item Firestore-a köçürülsün?':l==='tr'?'Mevcut 101 eşya Firestore\'a aktarılsın mı?':l==='en'?'Move the existing 101 items to Firestore?':'Перенести существующие 101 предмет в Firestore?',
'➕ Item əlavə et':l==='az'?'➕ Item əlavə et':l==='tr'?'➕ Eşya ekle':l==='en'?'➕ Add item':'➕ Добавить предмет',
'Item yeniləndi.':l==='az'?'Item yeniləndi.':l==='tr'?'Eşya güncellendi.':l==='en'?'Item updated.':'Предмет обновлён.',
'Item uğurla əlavə edildi.':l==='az'?'Item uğurla əlavə edildi.':l==='tr'?'Eşya başarıyla eklendi.':l==='en'?'Item added successfully.':'Предмет успешно добавлен.'
});}
function translateValue(value,l){
 if(typeof value!=='string') return value;
 const map=PHRASES[l]||{};
 if(map[value]) return map[value];
 for(const [a,b] of Object.entries(map)) if(value.includes(a)) value=value.split(a).join(b);
 return value;
}
function localize(root=document){
 const l=lang();
 root.querySelectorAll?.('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(T[l][k]!==undefined&&el.textContent!==T[l][k])el.textContent=T[l][k]});
 root.querySelectorAll?.('[data-i18n-placeholder]').forEach(el=>{const k=el.dataset.i18nPlaceholder;if(T[l][k]!==undefined)el.placeholder=T[l][k]});
 root.querySelectorAll?.('[data-i18n-title]').forEach(el=>{const k=el.dataset.i18nTitle;if(T[l][k]!==undefined)el.title=T[l][k]});
 root.querySelectorAll?.('[data-i18n-aria]').forEach(el=>{const k=el.dataset.i18nAria;if(T[l][k]!==undefined)el.setAttribute('aria-label',T[l][k])});
 root.querySelectorAll?.('option[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(T[l][k]!==undefined&&el.textContent!==T[l][k])el.textContent=T[l][k]});
 root.querySelectorAll?.('[data-i18n-meta]').forEach(el=>{const k=el.dataset.i18nMeta;if(T[l][k]!==undefined)el.setAttribute('content',T[l][k])});
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(n=>{if(n.parentElement?.closest('script,style,select'))return;const v=n.nodeValue;if(v.trim()){const nv=translateValue(v,l);if(nv!==v)n.nodeValue=nv;}});
 document.documentElement.lang=l;
 document.title=T[l].title;
 const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=l==='tr'?'MM2 eşya değerleri, talep, favoriler ve trade araçları.':l==='en'?'MM2 item values, demand, favorites and trade tools.':l==='ru'?'Ценности предметов MM2, спрос, избранное и инструменты трейда.':'MM2 item dəyərləri, tələb, favorilər və trade alətləri.';
 const picker=document.querySelector('.language-picker select');if(picker)picker.value=l;
 const label=document.querySelector('.language-picker');if(label)label.setAttribute('aria-label',T[l].language);
}
function installLanguagePicker(){
 const header=document.querySelector('header');if(!header)return;
 if(!header.querySelector('.language-picker')){
  const picker=document.createElement('label');picker.className='language-picker';
  picker.innerHTML='<span class="language-globe" aria-hidden="true">◎</span><select aria-label="Language"><option value="az">AZ — Azərbaycan</option><option value="tr">TR — Türkçe</option><option value="en">EN — English</option><option value="ru">RU — Русский</option></select></label>';
  (header.querySelector('.header-inner')||header).appendChild(picker);
  picker.querySelector('select').addEventListener('change',e=>{localStorage.setItem('mm2_language',e.target.value);location.reload()});
 }
 localize();
 const observer=new MutationObserver(mutations=>{for(const m of mutations)for(const n of m.addedNodes){if(n.nodeType===1)localize(n)}});
 observer.observe(document.body,{subtree:true,childList:true});
}
document.addEventListener('DOMContentLoaded',installLanguagePicker);