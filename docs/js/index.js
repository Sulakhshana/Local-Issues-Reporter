import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

import { firebaseConfig } from "../firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Leaflet map
window.initMap = async function () {
  const map = L.map('map').setView([28.6139, 77.2090], 11); // Delhi default center

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const issuesSnapshot = await getDocs(collection(db, "issues"));
  issuesSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.latitude && data.longitude) {
      const popupContent = `
        <div style="max-width: 200px;">
          <img src="${data.imageUrl}" alt="Issue Image" style="width: 100%; height: auto; border-radius: 5px;" />
          <p><strong>Description:</strong> ${data.description}</p>
          <p><strong>Status:</strong> <span style="color: ${data.status === 'Resolved' ? 'green' : 'red'};">${data.status}</span></p>
          <p><strong>Upvotes:</strong> ${data.upvotes || 0}</p>
        </div>
      `;
      L.marker([data.latitude, data.longitude]).addTo(map).bindPopup(popupContent);
    }
  });
};

window.onload = initMap;


