import { COLLECTIONS } from "@/constants/collections";
import { UserId, WithId } from "@/models/common.model";
import { User as UserModel } from "@/models/user.model";
import { firestoreConverter } from "@/utils/converter";
import {
  Firestore,
  WriteBatch,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
const userConverter = firestoreConverter<WithId<UserModel>>();
type omitKeys = "createdAt" | "createdBy" | "updatedAt" | "updatedBy";

type EditData = Omit<UserModel, omitKeys>;
export class User {
  db: Firestore;
  constructor(db: Firestore) {
    this.db = db;
  }
  async get(id: UserId) {
    const docRef = doc(this.db, COLLECTIONS.users, id).withConverter(userConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        id,
      };
    } else {
      throw new Error(`Invalid user id ${id}`);
    }
  }
  async getListByIds(userIds: UserId[]) {
    return await Promise.all<WithId<UserModel>>(userIds.map(async (id) => await this.get(id)));
  }
  edit(batch: WriteBatch, id: UserId, data: EditData, updatedBy: UserId) {
    const now = serverTimestamp();
    const docRef = doc(this.db, id).withConverter(userConverter);
    batch.set(
      docRef,
      {
        ...data,
        updatedBy,
        updatedAt: now,
      },
      { merge: true },
    );
  }
}
