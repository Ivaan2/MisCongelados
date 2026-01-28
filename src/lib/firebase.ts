import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const firebaseConfig = {
  apiKey: requireEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 'NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: requireEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: requireEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  messagingSenderId: requireEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requireEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, 'NEXT_PUBLIC_FIREBASE_APP_ID'),
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
