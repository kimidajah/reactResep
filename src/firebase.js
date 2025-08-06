import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAEUsIiek5ecq5csVFefNKBjjmvBxHmGd8",
  authDomain: "react123-5b0d0.firebaseapp.com",
  projectId: "react123-5b0d0",
  storageBucket: "react123-5b0d0.firebasestorage.app",
  messagingSenderId: "795220768439",
  appId: "1:795220768439:web:a5f9be6448b100d1d5bf32",
  measurementId: "G-HTJE0K97T4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
