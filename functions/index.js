const {onCall,HttpsError}=require('firebase-functions/v2/https');
const {initializeApp}=require('firebase-admin/app');
const {getFirestore,FieldValue}=require('firebase-admin/firestore');
initializeApp();
const db=getFirestore();
const ADMIN_EMAIL='mm2ultimatehub@gmail.com';
const adminOf=req=>req.auth?.token?.email?.toLowerCase()===ADMIN_EMAIL;
exports.purchaseCosmetic=onCall(async req=>{
 if(!req.auth)throw new HttpsError('unauthenticated','Giriş tələb olunur.');
 const id=String(req.data?.cosmeticId||'').trim();if(!id)throw new HttpsError('invalid-argument','Cosmetic seçilməyib.');
 return db.runTransaction(async tx=>{
  const userRef=db.doc('users/'+req.auth.uid),cosRef=db.doc('cosmetics/'+id);
  const [uSnap,cSnap]=await Promise.all([tx.get(userRef),tx.get(cosRef)]);
  if(!cSnap.exists||cSnap.data().active===false)throw new HttpsError('not-found','Məhsul tapılmadı.');
  const user=uSnap.data()||{},cos=cSnap.data()||{},coins=Number(user.coins||0),price=Math.max(0,Number(cos.price||0));
  const inv=Array.isArray(user.inventory)?user.inventory:[];if(inv.includes(id))return {ok:true,alreadyOwned:true,coins};
  if(coins<price)throw new HttpsError('failed-precondition','Kifayət qədər coin yoxdur.');
  const nextCoins=coins-price;
  tx.set(userRef,{coins:nextCoins,inventory:[...inv,id],updatedAt:FieldValue.serverTimestamp()},{merge:true});
  return {ok:true,coins:nextCoins,inventory:[...inv,id]};
 });
});
exports.equipCosmetic=onCall(async req=>{
 if(!req.auth)throw new HttpsError('unauthenticated','Giriş tələb olunur.');
 const id=String(req.data?.cosmeticId||'').trim();
 return db.runTransaction(async tx=>{
  const userRef=db.doc('users/'+req.auth.uid),cosRef=db.doc('cosmetics/'+id);
  const [uSnap,cSnap]=await Promise.all([tx.get(userRef),tx.get(cosRef)]);
  const user=uSnap.data()||{},cos=cSnap.data()||{},inv=Array.isArray(user.inventory)?user.inventory:[];
  if(!cSnap.exists||cos.active===false)throw new HttpsError('not-found','Cosmetic tapılmadı.');
  if(!inv.includes(id))throw new HttpsError('permission-denied','Bu cosmetic səndə yoxdur.');
  const equipped={...(user.equippedCosmetics||{}),[String(cos.type||'decoration')]:id};
  tx.set(userRef,{equippedCosmetics:equipped,updatedAt:FieldValue.serverTimestamp()},{merge:true});
  return {ok:true,equippedCosmetics:equipped};
 });
});
exports.adminGrantCoins=onCall(async req=>{
 if(!adminOf(req))throw new HttpsError('permission-denied','Admin icazəsi tələb olunur.');
 const uid=String(req.data?.uid||'').trim(),amount=Math.trunc(Number(req.data?.amount||0));
 if(!uid||!Number.isFinite(amount)||amount===0)throw new HttpsError('invalid-argument','UID və coin miqdarı lazımdır.');
 const ref=db.doc('users/'+uid),snap=await ref.get();if(!snap.exists)throw new HttpsError('not-found','İstifadəçi tapılmadı.');
 const current=Number(snap.data()?.coins||0),next=Math.max(0,current+amount);
 await ref.set({coins:next,updatedAt:FieldValue.serverTimestamp()},{merge:true});return {ok:true,coins:next};
});
exports.adminUpsertCosmetic=onCall(async req=>{
 if(!adminOf(req))throw new HttpsError('permission-denied','Admin icazəsi tələb olunur.');
 const data=req.data||{},id=String(data.id||'').trim(),name=String(data.name||'').trim(),type=String(data.type||'').trim();
 const price=Math.max(0,Math.trunc(Number(data.price||0)));
 if(!id||!name||!['frame','badge','decoration'].includes(type))throw new HttpsError('invalid-argument','Cosmetic məlumatı natamamdır.');
 await db.doc('cosmetics/'+id).set({id,name,type,price,image:String(data.image||'default.svg'),description:String(data.description||''),active:data.active!==false,updatedAt:FieldValue.serverTimestamp()},{merge:true});
 return {ok:true,id};
});
exports.adminSeedCosmetics=onCall(async req=>{
 if(!adminOf(req))throw new HttpsError('permission-denied','Admin icazəsi tələb olunur.');
 const list=Array.isArray(req.data?.items)?req.data.items:[];
 const batch=db.batch();list.slice(0,50).forEach(x=>batch.set(db.doc('cosmetics/'+String(x.id)),{...x,active:x.active!==false}));
 await batch.commit();return {ok:true,count:list.slice(0,50).length};
});
