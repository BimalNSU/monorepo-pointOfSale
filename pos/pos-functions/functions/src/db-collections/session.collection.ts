import { db } from "../firebase";
import { config } from "dotenv";
import {
  SessionId,
  UserId,
  COLLECTIONS,
  Session as SessionModel,
  WithId,
} from "@pos/shared-models";
import { CollectionReference, WriteBatch } from "firebase-admin/firestore";
import { firestoreConverter } from "../utils/converter";

config();
type MutableData = Partial<Omit<SessionModel, "userId">>;
const sessionFirestoreConverter = firestoreConverter<SessionModel>();
export class Session {
  collectionRef: CollectionReference;
  constructor() {
    this.collectionRef = db.collection(COLLECTIONS.sessions);
  }
  async create(data: SessionModel) {
    const sessionRef = this.collectionRef
      .doc()
      .withConverter(sessionFirestoreConverter);
    await sessionRef.set(data);
    return sessionRef;
  }
  update(id: SessionId, data: MutableData, batch: WriteBatch) {
    const now = new Date();
    const docRef = this.collectionRef
      .doc(id)
      .withConverter(sessionFirestoreConverter);
    return batch.set(docRef, { ...data, updatedAt: now }, { merge: true });
  }
  async get(id: SessionId) {
    const userDocRef = this.collectionRef
      .doc(id)
      .withConverter(sessionFirestoreConverter);

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
      .withConverter(sessionFirestoreConverter)
      .get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as WithId<SessionModel>;
    });
  }
  async findByUserId(userId: UserId) {
    const snapshot = await this.collectionRef
      .where("userId", "==", userId)
      .withConverter(sessionFirestoreConverter)
      .get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as WithId<SessionModel>;
    });
  }
  delete(id: SessionId, batch: WriteBatch) {
    const docRef = this.collectionRef.doc(id);
    return batch.delete(docRef);
  }
  async deleteAll(ids: SessionId[], batch: WriteBatch) {
    // const docRef = db.collection(COLLECTIONS.sessions).doc(this.userId); //path: sessions/{userId}
    // return await db.recursiveDelete(docRef); //TODO: test
    // return await db.recursiveDelete(this.collectionRef);
    return ids.map((id) => {
      const docRef = this.collectionRef.doc(id); //path: sessions/{userId}/activeSessions/{id}
      return batch.delete(docRef);
    });
  }
}
