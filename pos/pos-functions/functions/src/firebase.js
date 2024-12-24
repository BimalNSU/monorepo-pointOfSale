import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage, ref } from "firebase-admin/storage";
import serviceAccount from "../service-account.json";
import { credential } from "firebase-admin";

const projectId = process.env.PROJECT_ID; // it works because config() of dotenv is called before express app's initialization
const app = initializeApp({
  credential: applicationDefault(),
  // credential: cert(serviceAccount),
  // credential: credential.cert(serviceAccount),
  storageBucket: `${projectId}.appspot.com`,
});

// const projectId = app.options.credential.projectId; //locally working
// export const { arrayUnion, arrayRemove, increment, serverTimestamp } =
//   FieldValue;
const db = getFirestore(app);
// const bucket = getStorage().bucket(`${projectId}.appspot.com`);
const bucket = getStorage().bucket();
const auth = getAuth(app);
export { FieldValue, Timestamp, db, auth, bucket };
