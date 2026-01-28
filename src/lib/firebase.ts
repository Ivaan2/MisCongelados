import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB5yNUUMEhRv1YDQfOopl2a_khb2G0CRSU",
  authDomain: "studio-4537290699-7858b.firebaseapp.com",
  projectId: "studio-4537290699-7858b",
  storageBucket: "studio-4537290699-7858b.firebasestorage.app",
  messagingSenderId: "941138373143",
  appId: "1:941138373143:web:60e53b2bcd2746d9820a52"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
