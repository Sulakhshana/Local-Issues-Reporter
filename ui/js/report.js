// js/report.js
import { db, storage } from "../firebase-config.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// Auto detect location
navigator.geolocation.getCurrentPosition(
  (position) => {
    const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
    document.getElementById("location").value = coords;
  },
  (error) => {
    document.getElementById("location").value = "Location not available";
  }
);

// Image preview
document.getElementById("photo").addEventListener("change", function () {
  const file = this.files[0];
  const preview = document.getElementById("preview");
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

// Submit form
document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("photo").files[0];
  const location = document.getElementById("location").value;
  const type = document.getElementById("issueType").value;
  const desc = document.getElementById("description").value;

  if (!file) return alert("Please upload an image");

  const storageRef = ref(storage, `issues/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);

  await addDoc(collection(db, "issues"), {
    location,
    type,
    description: desc,
    imageUrl,
    upvotes: 0,
    status: "Pending",
    createdAt: serverTimestamp()
  });

  alert("✅ Issue reported successfully!");
  document.getElementById("reportForm").reset();
  document.getElementById("preview").classList.add("hidden");
});
