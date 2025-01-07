// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxht5FEtfRoqRFhING03lSo_cuCEexjpE",
  authDomain: "evently-665a5.firebaseapp.com",
  projectId: "evently-665a5",
  storageBucket: "evently-665a5.firebasestorage.app",
  messagingSenderId: "2408840794",
  appId: "1:2408840794:web:bb021b04a066b63603e263"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize auth and firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
