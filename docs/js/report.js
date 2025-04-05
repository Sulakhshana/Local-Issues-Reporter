document.addEventListener("DOMContentLoaded", () => {
  const reportForm = document.getElementById("reportForm");
  const detectBtn = document.getElementById("detectLocationBtn");
  const locationInput = document.getElementById("location");
  const imageInput = document.getElementById("image");

  reportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const issueType = document.getElementById("issueType").value;
    const description = document.getElementById("description").value;
    const location = locationInput.value;

    const file = imageInput.files[0];
    if (!file) {
      alert("Please upload an image.");
      return;
    }

    const imageData = await toBase64(file);

    const issue = {
      id: Date.now(),
      type: issueType,
      description,
      location,
      image: imageData,
      upvotes: 0,
      status: "Pending"
    };

    const existingIssues = JSON.parse(localStorage.getItem("issues") || "[]");
    existingIssues.push(issue);
    localStorage.setItem("issues", JSON.stringify(existingIssues));

    alert("✅ Issue reported successfully!");
    window.location.href = "index.html"; // Redirect to homepage
  });

  if (detectBtn) {
    detectBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
          locationInput.value = coords;
        });
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    });
  }

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
});

