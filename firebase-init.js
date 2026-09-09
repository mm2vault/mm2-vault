// Firebase web client initialization.
const firebaseConfig = {
  apiKey: "AIzaSyDKdE947q36KwQxkrxbUzpmoynaMsssWB8",
  authDomain: "scripthub-b95d1.firebaseapp.com",
  projectId: "scripthub-b95d1",
  storageBucket: "scripthub-b95d1.firebasestorage.app",
  messagingSenderId: "435891213405",
  appId: "1:435891213405:web:522b592d921689882629b4",
  measurementId: "G-PVXHHBYLGR"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
window.firebaseAuth = firebase.auth();
window.firebaseDb = firebase.firestore();
