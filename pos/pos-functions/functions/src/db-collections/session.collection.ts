import { db } from "../firebase";
import { config } from "dotenv";
import {
  ActiveSessionId,
  UserId,
  COLLECTIONS,
  ActiveSession as ActiveSessionModel,
  WithId,
} from "@pos/shared-models";
import { CollectionReference, WriteBatch } from "firebase-admin/firestore";
import { firestoreConverter } from "../utils/converter";

config();

const activeSessionFirstoreConverter = firestoreConverter<ActiveSessionModel>();
export class ActiveSession {
  collectionRef: CollectionReference;
  userId: UserId;
  constructor(userId: UserId) {
    this.collectionRef = db
      .collection(COLLECTIONS.sessions)
      .doc(userId)
      .collection(COLLECTIONS.activeSessions);
    this.userId = userId;
  }
  async create(data: ActiveSessionModel) {
    const sessionRef = this.collectionRef
      .doc()
      .withConverter(activeSessionFirstoreConverter);
    await sessionRef.set(data);
    return sessionRef;
  }
  update(
    id: ActiveSessionId,
    data: Partial<ActiveSessionModel>,
    batch: WriteBatch
  ) {
    const now = new Date();
    const docRef = this.collectionRef
      .doc(id)
      .withConverter(activeSessionFirstoreConverter);
    return batch.set(docRef, { ...data, updatedAt: now }, { merge: true });
  }
  async get(id: ActiveSessionId) {
    const userDocRef = this.collectionRef
      .doc(id)
      .withConverter(activeSessionFirstoreConverter);

    const documentSnapshot = await userDocRef.get();
    if (documentSnapshot.exists) {
      const rawData = documentSnapshot.data();
      return rawData ? { ...rawData, id } : undefined;
    } else {
      return undefined;
    }
  }
  async getAll() {
    const snapshot = await this.collectionRef
      .withConverter(activeSessionFirstoreConverter)
      .get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as WithId<ActiveSessionModel>;
    });
  }
  delete(id: ActiveSessionId, batch: WriteBatch) {
    const docRef = this.collectionRef.doc(id);
    return batch.delete(docRef);
  }
  async deleteAll(ids: ActiveSessionId[], batch: WriteBatch) {
    // const docRef = db.collection(COLLECTIONS.sessions).doc(this.userId); //path: sessions/{userId}
    // return await db.recursiveDelete(docRef); //TODO: test
    // return await db.recursiveDelete(this.collectionRef);
    return ids.map((id) => {
      const docRef = this.collectionRef.doc(id); //path: sessions/{userId}/activeSessions/{id}
      return batch.delete(docRef);
    });
  }
}
