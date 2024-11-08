// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";  // Authentication modules
import { getFirestore } from "firebase/firestore";  // Firestore module

const firebaseConfig = {
  apiKey: "AIzaSyAXycr9_8R1Y_7juwUyfWrsgEzkOkKtCSk",
  authDomain: "gainsphere-4011f.firebaseapp.com",
  projectId: "gainsphere-4011f",
  storageBucket: "gainsphere-4011f.appspot.com",
  messagingSenderId: "107513184865",
  appId: "1:107513184865:web:105fa9c54fd5c56cbfe020"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);  // Authentication instance
const db = getFirestore(app);  // Firestore instance
const googleProvider = new GoogleAuthProvider();  // Google Auth provider

export { auth, db, googleProvider };
