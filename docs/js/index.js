window.onload = function () {
  const map = L.map('map').setView([28.6139, 77.2090], 11); // Delhi center

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Static demo issues
  const demoIssues = [
    {
      latitude: 28.6139,
      longitude: 77.2090,
      description: "Pothole on main road near Connaught Place",
      image: "https://i.imgur.com/yW2W9SC.jpg",
      upvotes: 23,
      status: "Unresolved"
    },
    {
      latitude: 28.6448,
      longitude: 77.2167,
      description: "Garbage not collected near India Gate",
      image: "https://i.imgur.com/BJgqVCl.jpg",
      upvotes: 45,
      status: "Resolved"
    }
  ];

  // Function to display markers on map
  function addMarker(data) {
    const popupContent = `
      <div style="max-width: 200px;">
        <img src="${data.image}" style="width: 100%; border-radius: 5px;" />
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Status:</strong> <span style="color: ${data.status === 'Resolved' ? 'green' : 'red'};">${data.status}</span></p>
        <p><strong>Upvotes:</strong> ${data.upvotes || 0}</p>
      </div>
    `;
    L.marker([data.latitude, data.longitude]).addTo(map).bindPopup(popupContent);
  }

  // Add demo issues
  demoIssues.forEach((issue) => addMarker(issue));

  // Load issues from localStorage
  const savedIssues = JSON.parse(localStorage.getItem("issues") || "[]");

  savedIssues.forEach((issue) => {
    const [lat, lng] = issue.location.split(",").map(coord => parseFloat(coord));
    addMarker({
      latitude: lat,
      longitude: lng,
      description: issue.description,
      image: issue.image,
      upvotes: issue.upvotes,
      status: issue.status
    });
  });
};
