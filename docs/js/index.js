import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { firebaseConfig } from "../firebase-config.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Load Google Map and display issue markers
window.initMap = async function () {
  // Default to Delhi if location access fails
  const defaultCenter = { lat: 28.6448, lng: 77.216721 };

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: defaultCenter
  });

  // Try to get current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(userLocation);
      },
      () => {
        console.warn("Geolocation failed or denied. Using default location.");
      }
    );
  }

  // Fetch issues from Firestore
  const querySnapshot = await getDocs(collection(db, "issues"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const [lat, lng] = data.location.split(',').map(Number);

    const contentString = `
      <div style="max-width: 250px;">
        <img src="${data.imageUrl}" style="width:100%; height:120px; object-fit:cover; border-radius:5px; margin-bottom:8px;" />
        <p><strong>Type:</strong> ${data.issueType}</p>
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Status:</strong> 
          <span style="padding: 3px 6px; border-radius: 4px; color: white; background: ${data.status === 'Resolved' ? '#28a745' : '#ffc107'};">
            ${data.status}
          </span>
        </p>
        <p><strong>Upvotes:</strong> ${data.upvotes || 0}</p>
      </div>
    `;

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
    });

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
  });
};

