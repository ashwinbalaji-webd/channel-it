import "./App.css";
import { initializeApp } from "firebase/app"; // Correct import
import { getFirestore, serverTimestamp } from "firebase/firestore"; // Named import for Firestore
import { addDoc, collection, query, orderBy, limit } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Named imports for Auth
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";

const firebaseConfig = {
  apiKey: "AIzaSyA8pRkmOFXRvSdRYKqeDDnsEkBxCDcoUzE",
  authDomain: "channel-it-8306f.firebaseapp.com",
  projectId: "channel-it-8306f",
  storageBucket: "channel-it-8306f.appspot.com",
  messagingSenderId: "750356231793",
  appId: "1:750356231793:web:84ed929343d384b15c8dd0",
  measurementId: "G-4XJK98BGVP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // Use initializeApp
const db = getFirestore(app); // Initialize Firestore with the app
const auth = getAuth(app); // Initialize Firebase Auth with the app

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider(); // Create Google Auth provider
    signInWithPopup(auth, provider) // Use signInWithPopup for Google Auth
      .then((result) => {
        // Handle successful sign-in
      })
      .catch((error) => {
        console.error("Error during sign-in: ", error);
      });
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function ChatRoom() {
  // Reference to the 'messages' collection in Firestore
  const messagesRef = collection(db, "messages");

  // Create a query to order the messages by their 'createdAt' field and limit to 25
  const q = query(messagesRef, orderBy("createdAt"), limit(25));

  // Fetch the data from Firestore using the react-firebase-hooks hook
  const [messages] = useCollectionData(q, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    // Add the message to Firestore
    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      photoURL,
      uid,
    });

    setFormValue("");
  };

  return (
    <>
      <main>
        <ScrollableFeed>
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        </ScrollableFeed>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Message"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  console.log(auth.currentUser.uid);
  console.log(uid);
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <p>{text}</p>
      </div>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign out</button>
  );
}

export default App;
