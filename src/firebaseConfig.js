import { initializeApp  } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7e1zJwPCfzcCXAtcl34UwNM0e_ytDWeA",
  authDomain: "myfirstproject-39301.firebaseapp.com",
  projectId: "myfirstproject-39301",
  storageBucket: "myfirstproject-39301.firebasestorage.app",
  messagingSenderId: "477872149256",
  appId: "1:477872149256:web:d262b47a38755a9b7852bd",
  measurementId: "G-C4J2S43027"
};
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp);

export {auth, db}