import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCIiP9Ejq1jbu66KrU_6tSaYCbv1C5O6UA",
    authDomain: "react-pos-70e5e.firebaseapp.com",
    projectId: "react-pos-70e5e",
    storageBucket: "react-pos-70e5e.appspot.com",
    messagingSenderId: "673530317383",
    appId: "1:673530317383:web:eb51e48ebac587a3cfbf62",
    measurementId: "G-CR190PJ8E8"
  };

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);