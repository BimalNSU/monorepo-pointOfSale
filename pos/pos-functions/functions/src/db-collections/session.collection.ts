import { db } from "../firebase";
import { config } from "dotenv";
import {
  ActiveSessionId,
  UserId,
  COLLECTIONS,
  ActiveSession as ActiveSessionModel,
} from "@pos/shared-models";
import { CollectionReference } from "firebase-admin/firestore";
import { firestoreConverter } from "../utils/converter";

config();

const activeSessionFirstoreConverter = firestoreConverter<ActiveSessionModel>();
export class ActiveSession {
  collectionRef: CollectionReference;
  constructor(userId: UserId) {
    this.collectionRef = db
      .collection(COLLECTIONS.sessions)
      .doc(userId)
      .collection(COLLECTIONS.activeSessions);
  }
  async create(data: ActiveSessionModel) {
    const sessionRef = this.collectionRef
      .doc()
      .withConverter(activeSessionFirstoreConverter);
    await sessionRef.set(data);
    return sessionRef;
  }
  async update(id: ActiveSessionId, data: Partial<ActiveSessionModel>) {
    const now = new Date();
    return await this.collectionRef
      .doc(id)
      .withConverter(activeSessionFirstoreConverter)
      .set({ ...data, updatedAt: now }, { merge: true });
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
  async delete(id: ActiveSessionId) {
    return await this.collectionRef.doc(id).delete();
  }
}
