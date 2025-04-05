import { db } from "../firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

let map;

async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 28.6139, lng: 77.2090 },
    zoom: 12,
  });

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
        <img src="${data.imageUrl}" style="width:100%; border-radius:6px;" />
        <strong>${data.issueType}</strong><br>
        <small>${data.description}</small><br>
        <span>Status: ${data.status}</span><br>
        👍 Upvotes: ${data.upvotes || 0}
      </div>
    `;
    const infowindow = new google.maps.InfoWindow({ content: popup });
    marker.addListener("click", () => infowindow.open(map, marker));
  });
}

function parseCoords(str) {
  const [lat, lng] = str.split(',').map(Number);
  return (!isNaN(lat) && !isNaN(lng)) ? { lat, lng } : null;
}

window.initMap = initMap;

