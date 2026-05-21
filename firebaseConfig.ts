import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhGctFTf3b_MMf7_z-EcmaeiE52G71wM8",
  authDomain: "shevalue.firebaseapp.com",
  projectId: "shevalue",
  storageBucket: "shevalue.firebasestorage.app",
  messagingSenderId: "50233934596",
  appId: "1:50233934596:web:76d7815b9aa05086ca4651"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);