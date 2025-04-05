window.onload = function () {
  const map = L.map('map').setView([28.6139, 77.2090], 11); // Default center

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Sample dummy issue data (you can add more manually)
  const issues = [
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

  // Loop through issues and place markers
  issues.forEach((data) => {
    const popupContent = `
      <div style="max-width: 200px;">
        <img src="${data.imageUrl}" alt="Issue Image" style="width: 100%; height: auto; border-radius: 5px;" />
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Status:</strong> <span style="color: ${data.status === 'Resolved' ? 'green' : 'red'};">${data.status}</span></p>
        <p><strong>Upvotes:</strong> ${data.upvotes}</p>
      </div>
    `;
    L.marker([data.latitude, data.longitude]).addTo(map).bindPopup(popupContent);
  });
};
