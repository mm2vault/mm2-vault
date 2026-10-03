// Firebase web client initialization — MM2 Vault
const firebaseConfig = {
  apiKey: "AIzaSyBWnPbMCaQXR88AIvm6PAhm2G-KK0KA46w",
  authDomain: "mm2-vault.firebaseapp.com",
  projectId: "mm2-vault",
  storageBucket: "mm2-vault.firebasestorage.app",
  messagingSenderId: "1041979076763",
  appId: "1:1041979076763:web:218076ad6319e50533d63e",
  measurementId: "G-EHFTECEKS5"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
window.firebaseApp = firebase.app();
window.firebaseAuth = firebase.auth();
window.firebaseDb = firebase.firestore();
