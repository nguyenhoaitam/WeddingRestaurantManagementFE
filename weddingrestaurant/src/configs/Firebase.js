import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBTjDjKdViu4kSuyxRTzEWgqJ04WUxAZ18",
  authDomain: "wedding-chat-d9183.firebaseapp.com",
  projectId: "wedding-chat-d9183",
  storageBucket: "wedding-chat-d9183.appspot.com",
  messagingSenderId: "422080181810",
  appId: "1:422080181810:web:0dcb0cc2b442830d926e2b",
  measurementId: "G-CS7MR2HYLH"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);