import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_lajqIE4NSUaN4sGYCWLPrKJiT0nDHg0",
  authDomain: "fixmycity-1e70e.firebaseapp.com",
  projectId: "fixmycity-1e70e",
  storageBucket: "fixmycity-1e70e.firebasestorage.app",
  messagingSenderId: "658505949766",
  appId: "1:658505949766:web:06c3f379f9b52888426047"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db, firebaseConfig }; 
