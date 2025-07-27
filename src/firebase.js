// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAEMX3dF8nniPX6rgqsT9uoApR0KjU8yxg",
  authDomain: "myblog-auth-1278.firebaseapp.com",
  projectId: "myblog-auth-1278",
  storageBucket: "myblog-auth-1278.appspot.com",
  messagingSenderId: "255650074951",
  appId: "1:255650074951:web:f15f77a30a9f800495fc62",
  measurementId: "G-KVBFLMBPXC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const db = getFirestore(app);

const storage = getStorage(app);
export {  storage };


// npm install -g firebase-tools
// firebase login
// firebase init
// firebase deploy
