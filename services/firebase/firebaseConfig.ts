import { getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: Constants.expoConfig?.extra?.FIREBASE_APP_ID || "YOUR_APP_ID",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: Auth;

try {
  auth = initializeAuth(app);
} catch {
  auth = getAuth(app);
}

export { auth };
