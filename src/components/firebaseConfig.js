// Import de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB82-SVkgqPrRJ-g_NRmjHKQ6sbdNqy7YQ",
    authDomain: "geslec.firebaseapp.com",
    projectId: "geslec",
    storageBucket: "geslec.firebasestorage.app",
    messagingSenderId: "523122351757",
    appId: "1:523122351757:web:a55a1ae7d954a9f2550cc4",
    measurementId: "G-SBNG7716LZ"
  };

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
