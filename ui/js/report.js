// report.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { firebaseConfig } from "../firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Image preview and event listener fixed
document.getElementById("image").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById("preview");
      preview.src = e.target.result;
      preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

// ✅ Form submission logic with validation and feedback
document.getElementById("issueForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const issueType = document.getElementById("issueType").value;
  const description = document.getElementById("description").value.trim();
  const location = document.getElementById("location").value.trim();
  const file = document.getElementById("image").files[0];

  // ✅ Validate all fields
  if (!issueType) return alert("Please select an issue type.");
  if (!description) return alert("Please enter a description.");
  if (!location) return alert("Please provide a location.");
  if (!file) return alert("Please upload an image.");

  try {
    const storageRef = ref(storage, `issue-images/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    await addDoc(collection(db, "issues"), {
      issueType,
      description,
      location,
      imageUrl,
      status: "Pending",
      createdAt: serverTimestamp(),
    });

    // ✅ Reset form and preview
    e.target.reset();
    document.getElementById("preview").src = "";
    document.getElementById("preview").classList.add("hidden");

    // ✅ Redirect to home after successful submission
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error reporting issue:", error);
    alert("An error occurred while reporting the issue.");
  }
});

// ✅ Detect user location
window.detectLocation = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        document.getElementById("location").value = coords;
      },
      (err) => {
        alert("Unable to fetch location");
        console.error(err);
      }
    );
  } else {
    alert("Geolocation not supported");
  }
};

