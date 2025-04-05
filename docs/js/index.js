window.onload = function () {
  const map = L.map('map').setView([28.6139, 77.2090], 11); // Default center

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const issues = JSON.parse(localStorage.getItem("issues") || "[]");

  issues.forEach((issue, index) => {
    const coords = issue.location.split(",").map(coord => parseFloat(coord.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      const popupContent = `
        <div style="max-width: 200px;">
          <img src="${issue.image}" alt="Issue Image" style="width: 100%; height: auto; border-radius: 5px;" />
          <p><strong>Type:</strong> ${issue.type}</p>
          <p><strong>Description:</strong> ${issue.description}</p>
          <p><strong>Status:</strong> <span style="color: ${issue.status === 'Resolved' ? 'green' : 'orange'};">${issue.status}</span></p>
          <p><strong>Upvotes:</strong> ${issue.upvotes}</p>
        </div>
      `;

      const marker = L.marker(coords).addTo(map).bindPopup(popupContent);

      // Open popup for the latest issue added
      if (index === issues.length - 1) {
        marker.openPopup();
        map.setView(coords, 14); // Zoom into the new marker
      }
    }
  });
};
