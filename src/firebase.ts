import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaBOMfE0lmAaVWZFF2kG64WHCHUDpxdf0",
  authDomain: "progetto-1f548.firebaseapp.com",
  projectId: "progetto-1f548",
  storageBucket: "progetto-1f548.firebasestorage.app",
  messagingSenderId: "691917891926",
  appId: "1:691917891926:web:75524ea04b8410de0dcef7",
  measurementId: "G-YWLY2NQBSX"
};
export const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});