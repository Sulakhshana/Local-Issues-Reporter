// ui/js/report.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

import { firebaseConfig } from "../firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const issueType = document.getElementById("issueType").value;
  const description = document.getElementById("description").value;
  const location = document.getElementById("location").value;
  const image = document.getElementById("image").files[0];

  if (!image || !location || !description || !issueType) {
    alert("Please fill all fields and select an image.");
    return;
  }

  try {
    const storageRef = ref(storage, `issue_images/${Date.now()}_${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);

    await addDoc(collection(db, "issues"), {
      issueType,
      description,
      location,
      imageUrl,
      status: "Pending",
      upvotes: 0,
      createdAt: serverTimestamp()
    });

    alert("Issue reported successfully!");
    document.getElementById("reportForm").reset();
  } catch (error) {
    console.error("Error reporting issue:", error);
    alert("Error reporting issue. Please try again.");
  }
});


