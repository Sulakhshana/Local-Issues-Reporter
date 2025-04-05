document.addEventListener("DOMContentLoaded", () => {
  const reportForm = document.getElementById("reportForm");

  reportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const issueType = document.getElementById("issueType").value.trim();
    const description = document.getElementById("description").value.trim();
    const location = document.getElementById("location").value.trim();
    const imageFile = document.getElementById("image").files[0];

    if (!issueType || !description || !location || !imageFile) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    try {
      // Convert image to base64
      const imageBase64 = await toBase64(imageFile);

      // Create issue object
      const newIssue = {
        id: Date.now(),
        issueType,
        description,
        location,
        imageUrl: imageBase64,
        status: "pending",
        upvotes: 0,
        createdAt: new Date().toISOString(),
      };

      // Save issue to localStorage
      const issues = JSON.parse(localStorage.getItem("issues") || "[]");
      issues.push(newIssue);
      localStorage.setItem("issues", JSON.stringify(issues));

      alert("✅ Issue reported successfully!");
      window.location.href = "index.html";
    } catch (err) {
      console.error("Error reporting issue:", err);
      alert("⚠️ Failed to report issue. Please try again.");
    }
  });

  // Detect current location
  document.querySelector(".detect-location a").addEventListener("click", (e) => {
    e.preventDefault();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
          document.getElementById("location").value = coords;
        },
        (err) => {
          alert("⚠️ Location access denied or failed.");
          console.error("Geolocation error:", err);
        }
      );
    } else {
      alert("❌ Geolocation not supported by your browser.");
    }
  });

  // Convert File to base64
  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
});

