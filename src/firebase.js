// src/firebase.js
// LANGKAH: Gantikan nilai di bawah dengan Firebase config anda
// Pergi ke https://console.firebase.google.com → Buat projek baru → Web App → Salin config

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcL3FKUfVVnsB1KHkAnmxpIizfTETjo6k",
  authDomain: "algolens-ae69a.firebaseapp.com",
  projectId: "algolens-ae69a",
  storageBucket: "algolens-ae69a.firebasestorage.app",
  messagingSenderId: "672059533566",
  appId: "1:672059533566:web:f092f9a27f2e3b0024ddaf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
