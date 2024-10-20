import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const provider = new firebase.auth.GoogleAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyA8pRkmOFXRvSdRYKqeDDnsEkBxCDcoUzE",
  authDomain: "channel-it-8306f.firebaseapp.com",
  projectId: "channel-it-8306f",
  storageBucket: "channel-it-8306f.appspot.com",
  messagingSenderId: "750356231793",
  appId: "1:750356231793:web:84ed929343d384b15c8dd0",
  measurementId: "G-4XJK98BGVP"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const analytics = getAnalytics(app);

export { db, auth, provider, storage };
