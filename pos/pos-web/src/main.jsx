import React from "react";
import ReactDOM from "react-dom/client";
import { FirebaseAppProvider, AuthProvider, StorageProvider } from "reactfire";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import App from "./App";
import { initializeApp } from "firebase/app";
import { FirestoreProvider } from "reactfire";
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_apiKey,
  authDomain: env.VITE_authDomain,
  projectId: env.VITE_projectId,
  storageBucket: env.VITE_storageBucket,
  messagingSenderId: env.VITE_messagingSenderId,
  appId: env.VITE_appId,
  measurementId: env.VITE_measurementId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// const app = useFirebaseApp()
const firestoreInstance = getFirestore(app);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={firestoreInstance}>
          <StorageProvider sdk={storage}>
            <App />
          </StorageProvider>
        </FirestoreProvider>
      </AuthProvider>
    </FirebaseAppProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
