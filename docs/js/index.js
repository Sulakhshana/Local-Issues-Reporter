import { db } from "../firebase-config.js";
import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

let map;

async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 28.6139, lng: 77.2090 },
    zoom: 12,
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const userPos = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      map.setCenter(userPos);
    });
  }

  const querySnapshot = await getDocs(collection(db, "issues"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const position = parseCoords(data.location);
    if (!position) return;

    const marker = new google.maps.Marker({
      position,
      map,
    });

    const contentString = `
      <div style="max-width: 250px">
        <img src="${data.imageUrl}" width="100%" style="border-radius:6px;"><br>
        <strong>${data.issueType}</strong><br>
        ${data.description}<br>
        <span class="badge ${data.status === 'resolved' ? 'resolved' : 'pending'}">
          ${data.status}
        </span><br>
        👍 Upvotes: <span id="vote-count-${docSnap.id}">${data.upvotes}</span><br>
        <button class="upvote-button" onclick="upvoteIssue('${docSnap.id}')">Upvote</button>
      </div>
    `;

    const infowindow = new google.maps.InfoWindow({ content: contentString });
    marker.addListener("click", () => infowindow.open(map, marker));
  });
}

window.upvoteIssue = async function (id) {
  const issueRef = doc(db, "issues", id);
  const voteSpan = document.getElementById(`vote-count-${id}`);
  const currentVotes = parseInt(voteSpan.innerText || "0", 10);
  await updateDoc(issueRef, { upvotes: currentVotes + 1 });
  voteSpan.innerText = currentVotes + 1;
};

function parseCoords(coordStr) {
  const [lat, lng] = coordStr.split(",").map(Number);
  return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
}

window.initMap = initMap;

