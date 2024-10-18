import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
import { getDatabase } from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDxhcLSBLsOvg_6B-HY0aXoAC-Yu5eAesE',
  authDomain: 'nova-demo-13e33.firebaseapp.com',
  databaseURL: 'https://nova-demo-13e33-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'nova-demo-13e33',
  storageBucket: 'nova-demo-13e33.appspot.com',
  messagingSenderId: "773007712209",
  appId: "1:773007712209:web:ca2c68e7b39f2c9d748af0"
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export const db = getDatabase(app);