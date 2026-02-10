import { COLLECTIONS, ShopId, ShopRole } from "@pos/shared-models";
import { UserId, WithId, User as UserModel } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import {
  FieldValue,
  Firestore,
  WriteBatch,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
const userConverter = firestoreConverter<WithId<UserModel>>();
type omitKeys = "createdAt" | "createdBy" | "updatedAt" | "updatedBy";

type EditData = Omit<UserModel, omitKeys | "shopIds" | "shopRoles"> & {
  shopIds?: ShopId[] | FieldValue;
  shopRoles?: Record<ShopId, ShopRole> | FieldValue;
};
export class User {
  db: Firestore;
  constructor(db: Firestore) {
    this.db = db;
  }
  async get(id: UserId) {
    const docRef = doc(this.db, COLLECTIONS.users, id).withConverter(userConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { password, ...rest } = docSnap.data();
      return {
        ...rest,
        id,
      };
    } else {
      throw new Error(`Invalid user id ${id}`);
    }
  }
  async getListByIds(userIds: UserId[]) {
    return await Promise.all<WithId<Omit<UserModel, "password">>>(
      userIds.map(async (id) => await this.get(id)),
    );
  }
  edit(batch: WriteBatch, id: UserId, data: Partial<EditData>, updatedBy: UserId) {
    const now = serverTimestamp();
    const docRef = doc(this.db, COLLECTIONS.users, id).withConverter(userConverter);
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
