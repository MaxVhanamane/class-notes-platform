// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-rv5fEbVcjg_tLndC6fILpqBloagjHp8",
    authDomain: "shejalesir-6b2d8.firebaseapp.com",
    projectId: "shejalesir-6b2d8",
    storageBucket: "shejalesir-6b2d8.appspot.com",
    messagingSenderId: "1059909481946",
    appId: "1:1059909481946:web:5be92a9f570942dbdf3ce3"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage =getStorage(app)
