import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
import {getAuth} from 'firebase/auth'

// const firebaseConfig = {
//   apiKey: "AIzaSyBgLOGJ2lB46UyrjlSYpp0XMRPQRjNZmSE",
//   authDomain: "thread-d2124.firebaseapp.com",
//   projectId: "thread-d2124",
//   storageBucket: "thread-d2124.appspot.com",
//   messagingSenderId: "875458394025",
//   appId: "1:875458394025:web:d5182461ec1c5fcd5eb6b8"
// };

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); 

