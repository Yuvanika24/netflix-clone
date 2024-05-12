import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";//db
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBO5YGfIsfEEVqHvVMN-6yjwui-13EGiG4",
  authDomain: "netflix-clone-51a50.firebaseapp.com",
  projectId: "netflix-clone-51a50",
  storageBucket: "netflix-clone-51a50.appspot.com",
  messagingSenderId: "209675127372",
  appId: "1:209675127372:web:45773d8c50cffaf62d82e9",
  measurementId: "G-SJMW425BN4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { app, db, auth };



