// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"; // ✅ use CDN import
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js"; // ✅ for image uploads
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js"; // ✅ for database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_lajqIE4NSUaN4sGYCWLPrKJiT0nDHg0",
  authDomain: "fixmycity-1e70e.firebaseapp.com",
  projectId: "fixmycity-1e70e",
  storageBucket: "fixmycity-1e70e.appspot.com",  // 👈 fixed typo here
  messagingSenderId: "658505949766",
  appId: "1:658505949766:web:06c3f379f9b52888426047"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore & Storage
export const db = getFirestore(app);
export const storage = getStorage(app);
