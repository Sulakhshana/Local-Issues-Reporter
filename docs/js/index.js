window.onload = function () {
  const map = L.map('map').setView([28.6139, 77.2090], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Function to add marker
  function addMarker({ latitude, longitude, description, image, upvotes = 0, status }) {
    const popupContent = `
      <div style="max-width: 200px;">
        <img src="${image}" style="width: 100%; border-radius: 5px;" />
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Status:</strong> <span style="color: ${status === 'Resolved' ? 'green' : 'red'};">${status}</span></p>
        <p><strong>Upvotes:</strong> ${upvotes}</p>
      </div>
    `;
    L.marker([latitude, longitude]).addTo(map).bindPopup(popupContent);
  }

  // Add two demo markers
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
  demoIssues.forEach(addMarker);

  // Load all submitted issues from localStorage
  const savedIssues = JSON.parse(localStorage.getItem("issues") || "[]");

  savedIssues.forEach((issue) => {
    // Safely parse coordinates
    if (issue.location) {
      const [latStr, lngStr] = issue.location.split(",").map(val => val.trim());
      const latitude = parseFloat(latStr);
      const longitude = parseFloat(lngStr);
      if (!isNaN(latitude) && !isNaN(longitude)) {
        addMarker({
          latitude,
          longitude,
          description: issue.description,
          image: issue.image,
          upvotes: issue.upvotes,
          status: issue.status
        });
      }
    }
  });
};

