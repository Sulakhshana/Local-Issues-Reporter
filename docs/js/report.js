import { db, storage } from "../firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const issueType = document.getElementById("issueType").value;
  const description = document.getElementById("description").value;
  const imageFile = document.getElementById("image").files[0];
  const location = document.getElementById("location").value;

  if (!imageFile) return alert("Please upload an image");

  const imageRef = ref(storage, `issue_images/${Date.now()}_${imageFile.name}`);
  await uploadBytes(imageRef, imageFile);
  const imageUrl = await getDownloadURL(imageRef);

  await addDoc(collection(db, "issues"), {
    issueType,
    description,
    imageUrl,
    location,
    status: "pending",
    upvotes: 0,
    createdAt: serverTimestamp(),
  });

  alert("Issue reported successfully!");
  window.location.href = "index.html";
});

document.querySelector(".detect-location a").addEventListener("click", (e) => {
  e.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
      document.getElementById("location").value = coords;
    }, () => {
      alert("Location access denied.");
    });
  } else {
    alert("Geolocation not supported.");
  }
});

