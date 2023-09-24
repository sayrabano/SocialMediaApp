import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxQFvT6daLWePkSo9qopU3lHVH5UgpEHc",
  authDomain: "socialmediaapp-304a6.firebaseapp.com",
  projectId: "socialmediaapp-304a6",
  storageBucket: "socialmediaapp-304a6.appspot.com",
  messagingSenderId: "571252661065",
  appId: "1:571252661065:web:97657cef2ed17bc7581898"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const storage = getStorage();
export const db = getFirestore(app);

