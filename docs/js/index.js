import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { firebaseConfig } from "../firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let map;

window.initMap = async function () {
  try {
    // Initialize Google Map
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 28.6139, lng: 77.2090 }, // Default center (New Delhi)
      zoom: 12,
    });

    // Fetch issues from Firestore
    const querySnapshot = await getDocs(collection(db, "issues"));

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const coords = parseCoords(data.location);

      if (!coords) return;

      // Add marker to map
      const marker = new google.maps.Marker({
        position: coords,
        map,
      });

      // Info window content
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

      // Add click listener to marker
      marker.addListener("click", () => {
        infowindow.open(map, marker);
      });
    });
    
    console.log("Map and markers loaded successfully.");
    
  } catch (error) {
    console.error("Error initializing map or loading issues:", error);
    document.getElementById("map").innerHTML = 
      "<p>Error loading map. Please check console for details.</p>";
  }
};

// Helper function to parse coordinates
function parseCoords(str) {
  if (!str || typeof str !== "string") return null;
  
  const [lat, lng] = str.split(",").map(Number);
  
  return (!isNaN(lat) && !isNaN(lng)) ? { lat, lng } : null;
}
