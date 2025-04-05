window.onload = function () {
  const map = L.map('map').setView([28.6139, 77.2090], 11); // Default center

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Show hardcoded sample issues
  const demoIssues = [
    {
      latitude: 28.6139,
      longitude: 77.2090,
      description: "Pothole on main road near Connaught Place",
      imageUrl: "https://i.imgur.com/yW2W9SC.jpg",
      upvotes: 23,
      status: "Unresolved"
    },
    {
      latitude: 28.6448,
      longitude: 77.2167,
      description: "Garbage not collected near India Gate",
      imageUrl: "https://i.imgur.com/BJgqVCl.jpg",
      upvotes: 45,
      status: "Resolved"
    }
  ];

  demoIssues.forEach(data => addMarker(data.latitude, data.longitude, data.description, data.imageUrl, data.upvotes, data.status));

  // 🔥 Load user-reported issues from localStorage
  const storedIssues = JSON.parse(localStorage.getItem("issues") || "[]");

  storedIssues.forEach(issue => {
    const [lat, lng] = issue.location.split(',').map(coord => parseFloat(coord.trim()));
    addMarker(lat, lng, issue.description, issue.image, issue.upvotes, issue.status);
  });

  function addMarker(lat, lng, description, imageUrl, upvotes, status) {
    const popupContent = `
      <div style="max-width: 200px;">
        <img src="${imageUrl}" alt="Issue Image" style="width: 100%; height: auto; border-radius: 5px;" />
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Status:</strong> <span style="color: ${status === 'Resolved' ? 'green' : 'red'};">${status}</span></p>
        <p><strong>Upvotes:</strong> ${upvotes}</p>
      </div>
    `;
    L.marker([lat, lng]).addTo(map).bindPopup(popupContent);
  }
};

