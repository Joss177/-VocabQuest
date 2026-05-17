import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbui4uEX_yADr5nBhv8UmV0yX9B77YU0o",
  authDomain: "vocabquest-ebb96.firebaseapp.com",
  projectId: "vocabquest-ebb96",
  storageBucket: "vocabquest-ebb96.firebasestorage.app",
  messagingSenderId: "330442879459",
  appId: "1:330442879459:web:7928b220f88fdf6161b0d6",
  measurementId: "G-9KRFD47P9N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);