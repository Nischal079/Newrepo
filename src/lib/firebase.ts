import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  
    apiKey: "AIzaSyDMKGGeepmzqgQeSf4aSzTSmR2sQJjWcGY",
    authDomain: "nighthub-assets.firebaseapp.com",
    projectId: "nighthub-assets",
    storageBucket: "nighthub-assets.firebasestorage.app",
    messagingSenderId: "484656313870",
    appId: "1:484656313870:web:593f3f89431c7a5ae6ee5f"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get service instances
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };