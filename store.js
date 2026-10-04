// MM2 Vault — cosmetic store
const FALLBACK_COSMETICS=[
 {id:'aurora-frame',name:'Aurora Frame',type:'frame',price:900,description:'Neon purple avatar frame.',image:'https://i.imgur.com/0aseHjC.gif'},
 {id:'void-frame',name:'Void Frame',type:'frame',price:1200,description:'Dark animated avatar frame.',image:'https://i.imgur.com/TLBHiUn.gif'},
 {id:'ember-frame',name:'Ember Frame',type:'frame',price:1500,description:'Animated red-gold frame.',image:'https://i.imgur.com/5mFOKEl.gif'},
 {id:'vault-badge',name:'Vault Member',type:'badge',price:500,description:'MM2 Vault profile badge.',image:'default.svg'},
 {id:'market-badge',name:'Market Hunter',type:'badge',price:700,description:'Rare market hunter badge.',image:'default.svg'},
 {id:'purple-glow',name:'Purple Glow',type:'decoration',price:1000,description:'Soft purple profile decoration.',image:'default.svg'}
];
let cosmetics=[],currentUser=null,activeCat='all';
const $=id=>document.getElementById(id);
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
async function loadCosmetics(){
 try{const s=await firebaseDb.collection('cosmetics').where('active','==',true).get();cosmetics=s.docs.map(d=>({id:d.id,...d.data()}));}
 catch(e){cosmetics=FALLBACK_COSMETICS}
 if(!cosmetics.length)cosmetics=FALLBACK_COSMETICS;
 renderStore();
}
function ownedIds(){return Array.isArray(currentUser?.inventory)?currentUser.inventory:[]}
function equipped(){return currentUser?.equippedCosmetics||{}}
function renderStore(){
 const root=$('storeGrid'),owned=ownedIds(),eq=equipped();
 const list=activeCat==='all'?cosmetics:cosmetics.filter(x=>x.type===activeCat);
 root.innerHTML=list.length?list.map(c=>`
  <article class="cosmetic-card"><div class="cosmetic-visual"><img class="cosmetic-image" src="${esc(c.image||'default.svg')}" alt="${esc(c.name)}"></div><div class="cosmetic-body"><h3>${esc(c.name)}</h3><p>${esc(c.description||'Profile cosmetic')}</p><div class="cosmetic-price"><span class="coin-price">◈ ${Number(c.price||0).toLocaleString()}</span><button class="store-button ${eq[c.type]===c.id?'equipped':owned.includes(c.id)?'owned':''}" data-id="${esc(c.id)}">${eq[c.type]===c.id?'Aktiv':owned.includes(c.id)?'İnventory':'Al'}</button></div></div></article>
 `).join(''):'<div class="store-empty">Bu kateqoriyada məhsul yoxdur.</div>';
 root.querySelectorAll('.cosmetic-image').forEach(img=>img.addEventListener('error',()=>{img.src='default.svg'}));
 root.querySelectorAll('.store-button').forEach(b=>b.addEventListener('click',()=>handleCosmetic(b.dataset.id)));
 $('coinBalance').textContent=Number(currentUser?.coins||0).toLocaleString();
}
async function handleCosmetic(id){
 const c=cosmetics.find(x=>x.id===id);if(!c)return;
 const own=ownedIds().includes(id),active=equipped()[c.type]===id;
 if(!currentUser){document.getElementById('storeLogin')?.click();return}
 if(active)return;
 if(own){await callFn('equipCosmetic',{cosmeticId:id});const s=await firebaseDb.collection('users').doc(currentUser.uid).get();currentUser={uid:currentUser.uid,...(s.data()||{})};renderStore();return}
 openConfirm(c);
}
function openConfirm(c){
 $('storeModalRoot').innerHTML='<div class="store-modal-backdrop"><div class="store-modal"><span class="store-kicker">CONFIRM PURCHASE</span><h2>'+esc(c.name)+'</h2><p>'+esc(c.description||'')+'</p><p style="margin-top:10px"><b style="color:#f4c95d">◈ '+Number(c.price||0).toLocaleString()+'</b> coin</p><div class="store-modal-actions"><button class="store-button" id="cancelBuy">İmtina</button><button class="store-button equipped" id="confirmBuy">Satın al</button></div></div></div>';
 $('cancelBuy').onclick=()=>{ $('storeModalRoot').innerHTML='' };
 $('confirmBuy').onclick=async()=>{ $('confirmBuy').disabled=true;try{await callFn('purchaseCosmetic',{cosmeticId:c.id});const s=await firebaseDb.collection('users').doc(currentUser.uid).get();currentUser={uid:currentUser.uid,...(s.data()||{})};renderStore();$('storeModalRoot').innerHTML=''}catch(e){$('confirmBuy').disabled=false;alert(e.message)} };
}
async function callFn(name,data){
 if(!window.firebaseFunctions)throw new Error('Firebase Functions bağlantısı hazır deyil. Functions deploy edilməlidir.');
 const fn=window.firebaseFunctions.httpsCallable(name);const result=await fn(data);return result.data;
}
document.querySelectorAll('.store-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.store-tab').forEach(x=>x.classList.remove('active'));tab.classList.add('active');activeCat=tab.dataset.cat;renderStore()}));
window.firebaseAuth.onAuthStateChanged(async u=>{currentUser=u;if(u){const s=await firebaseDb.collection('users').doc(u.uid).get();currentUser={uid:u.uid,...(s.data()||{})};}renderStore()});
document.addEventListener('DOMContentLoaded',()=>loadCosmetics());

document.getElementById('storeLogin')?.addEventListener('click',e=>{e.preventDefault();if(typeof openAuth==='function')openAuth();});
