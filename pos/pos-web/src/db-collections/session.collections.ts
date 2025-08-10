import { SessionId, COLLECTIONS } from "@pos/shared-models";
import { CollectionReference, Firestore, collection, deleteDoc, doc } from "firebase/firestore";

export class Session {
  collectionRef: CollectionReference;
  constructor(db: Firestore) {
    this.collectionRef = collection(db, COLLECTIONS.sessions);
  }
  async delete(id: SessionId) {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
  }
}
