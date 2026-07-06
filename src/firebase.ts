import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUDt08i9Fy8N6Pbga3a4DRvwtnWN37XpY",
  authDomain: "progetto-saw-d4dbb.firebaseapp.com",
  projectId: "progetto-saw-d4dbb",
  storageBucket: "progetto-saw-d4dbb.firebasestorage.app",
  messagingSenderId: "633534228267",
  appId: "1:633534228267:web:f825cf9b19226f01df876e"
};
export const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});