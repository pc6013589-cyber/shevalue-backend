import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChMeLRFhbEUbjOMQk1LFL8CXOSfIKK6WM",
  authDomain: "shevalue.firebaseapp.com",
  projectId: "shevalue",
  storageBucket: "shevalue.firebasestorage.app",
  messagingSenderId: "50233934596",
  appId: "1:50233934596:web:76d7815b9aa05086ca4651"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);