import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0...",
  authDomain: "civic-issue-reporter.firebaseapp.com",
  projectId: "civic-issue-reporter",
  storageBucket: "civic-issue-reporter.appspot.com",
  messagingSenderId: "415273797037",
  appId: "1:415273797037:web:304c4d1625c32d3282e6fd",
  measurementId: "G-W1TXWGVB3C"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
