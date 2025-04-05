import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { firebaseConfig } from "../firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let map;

window.initMap = async function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 28.6139, lng: 77.2090 },
    zoom: 12,
  });

  try {
    const querySnapshot = await getDocs(collection(db, "issues"));

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const coords = parseCoords(data.location);

      if (!coords) return;

      const marker = new google.maps.Marker({
        position: coords,
        map,
      });

      const popup = `
        <div style="max-width: 200px;">
          <img src="${data.imageUrl}" style="width:100%; border-radius:6px; margin-bottom:6px;" />
          <strong>${data.issueType || 'Issue'}</strong><br>
          <small>${data.description || ''}</small><br>
          <span>Status: <b>${data.status || 'Pending'}</b></span><br>
          👍 Upvotes: ${data.upvotes || 0}
        </div>
      `;

      const infowindow = new google.maps.InfoWindow({ content: popup });

      marker.addListener("click", () => {
        infowindow.open(map, marker);
      });
    });
  } catch (error) {
    console.error("Error loading issues:", error);
  }
};

function parseCoords(str) {
  if (!str || typeof str !== "string") return null;
  const [lat, lng] = str.split(",").map(Number);
  return (!isNaN(lat) && !isNaN(lng)) ? { lat, lng } : null;
}

