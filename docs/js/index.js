// index.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  increment
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { firebaseConfig } from "../firebase-config.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Mapbox Setup
mapboxgl.accessToken = 'pk.eyJ1Ijoic3VsYWtoc2hhbmEyNSIsImEiOiJjbXYxM3ZrbGowM3ZjM3BtNmdtaWk3M2R0In0.BZ-8LDI7UmDAORqWYiU9TA';

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true });

function successLocation(position) {
  setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
  setupMap([77.216721, 28.6448]); // Default to Delhi
}

function setupMap(center) {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: center,
    zoom: 12
  });

  loadMarkers(map);
}

async function loadMarkers(map) {
  const querySnapshot = await getDocs(collection(db, "issues"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const [lat, lng] = data.location.split(',').map(Number);

    const popupContent = `
      <div class="text-sm">
        <img src="${data.imageUrl}" alt="Issue Image" class="w-full h-32 object-cover rounded mb-2" />
        <p><strong>Type:</strong> ${data.issueType}</p>
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Status:</strong> <span class="px-2 py-1 rounded text-white text-xs ${data.status === 'Resolved' ? 'bg-green-600' : 'bg-yellow-500'}">${data.status}</span></p>
        <p><strong>Upvotes:</strong> <span id="upvote-${docSnap.id}">${data.upvotes || 0}</span></p>
        <button class="mt-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700" onclick="upvote('${docSnap.id}')">👍 Upvote</button>
      </div>
    `;

    const marker = new mapboxgl.Marker({ color: "#e63946" })
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setHTML(popupContent))
      .addTo(map);
  });
}

// 🔹 Upvote Logic
window.upvote = async function (id) {
  const voted = localStorage.getItem(`voted-${id}`);
  if (voted) {
    alert("You have already upvoted this issue!");
    return;
  }

  const issueRef = doc(db, "issues", id);
  await updateDoc(issueRef, {
    upvotes: increment(1)
  });

  const upvoteElem = document.getElementById(`upvote-${id}`);
  if (upvoteElem) {
    upvoteElem.textContent = parseInt(upvoteElem.textContent) + 1;
  }

  localStorage.setItem(`voted-${id}`, "true");
};
