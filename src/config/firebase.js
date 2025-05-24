import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDsC3ZFA2eF-_qqmcNUswssmkaoOHZNNmE",
  authDomain: "syria-acad.firebaseapp.com",
  projectId: "syria-acad",
  storageBucket: "syria-acad.appspot.com", // صحح هنا: يجب أن يكون .appspot.com
  messagingSenderId: "1098511219861",
  appId: "1:1098511219861:web:013ad424b48adbf5f92f9c",
  measurementId: "G-84K03Z657B"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// تصدير الخدمات لاستخدامها في أي مكان بالمشروع
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;