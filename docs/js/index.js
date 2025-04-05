// Replace 'YOUR_MAPBOX_TOKEN' with your actual Mapbox token
const mapboxToken = 'YOUR_MAPBOX_TOKEN';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Mapbox
  mapboxgl.accessToken = mapboxToken;

  const map = new mapboxgl.Map({
    container: 'map', // ID of the map container in HTML
    style: 'mapbox://styles/mapbox/streets-v12', // Map style
    center: [77.2090, 28.6139], // Default center (Delhi)
    zoom: 12, // Default zoom level
  });

  // Try to get user's location and center the map there
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 13,
        });
      },
      () => {
        console.warn("Geolocation failed or was denied.");
      }
    );
  }

  // Hardcoded issues data (replace this with Firestore data later)
  const issues = [
    {
      location: "28.6139,77.2090",
      issueType: "Pothole",
      description: "Large pothole near central Delhi",
      imageUrl: "https://via.placeholder.com/150",
      status: "Pending",
      upvotes: 5,
    },
    {
      location: "28.5355,77.3910",
      issueType: "Garbage",
      description: "Garbage pile needs removal",
      imageUrl: "https://via.placeholder.com/150",
      status: "In Progress",
      upvotes: 12,
    },
    {
      location: "28.7041,77.1025",
      issueType: "Streetlight",
      description: "Street light not working for 3 days",
      imageUrl: "https://via.placeholder.com/150",
      status: "Resolved",
      upvotes: 8,
    },
  ];

  // Add markers for each issue
  issues.forEach((issue) => {
    const coords = parseCoords(issue.location); // Parse latitude and longitude
    if (!coords) return;

    // Create a marker element
    const markerEl = document.createElement('div');
    markerEl.className = 'marker';
    markerEl.style.backgroundColor = getStatusColor(issue.status);

    // Create a popup with issue details
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div style="max-width: 200px;">
        <img src="${issue.imageUrl}" style="width:100%; border-radius:6px; margin-bottom:6px;" />
        <strong>${issue.issueType}</strong><br>
        <small>${issue.description}</small><br>
        <span>Status: <b style="color:${getStatusColor(issue.status)}">${issue.status}</b></span><br>
        <div style="display:flex; align-items:center; margin-top:5px;">
          <button class="upvote-btn" data-id="${issue.location}" style="background:none; border:none; cursor:pointer;">👍</button>
          <span style="margin-left:5px;">${issue.upvotes}</span>
        </div>
      </div>
    `);

    // Add marker to the map
    new mapboxgl.Marker(markerEl)
      .setLngLat([coords.lng, coords.lat])
      .setPopup(popup)
      .addTo(map);
  });

  // Handle upvote button clicks
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('upvote-btn')) {
      const issueId = e.target.getAttribute('data-id');
      
      // Update the upvote count in the UI
      const upvoteCount = e.target.nextElementSibling;
      upvoteCount.textContent = parseInt(upvoteCount.textContent) + 1;

      // Prevent multiple votes from the same browser using localStorage
      const upvotedIssues = JSON.parse(localStorage.getItem('upvotedIssues') || '[]');
      if (!upvotedIssues.includes(issueId)) {
        upvotedIssues.push(issueId);
        localStorage.setItem('upvotedIssues', JSON.stringify(upvotedIssues));
      }
    }
  });
});

// Helper function to parse coordinates from a string
function parseCoords(str) {
  if (!str || typeof str !== 'string') return null;
  
  const [lat, lng] = str.split(',').map(Number);
  
  return !isNaN(lat) && !isNaN(lng) ? { lat, lng } : null;
}

// Helper function to get color based on issue status
function getStatusColor(status) {
  switch (status) {
    case 'Resolved':
      return '#4CAF50'; // Green
    case 'In Progress':
      return '#FFC107'; // Yellow
    case 'Pending':
      return '#F44336'; // Red
    default:
      return '#2196F3'; // Blue (default)
  }
}

