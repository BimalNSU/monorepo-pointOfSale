import { db } from "../firebase";
import { config } from "dotenv";
import { COLLECTIONS } from "../constants/collections";
import { UserId, User as UserModel, WithId } from "@pos/shared-models";
import { CollectionReference, WriteBatch } from "firebase-admin/firestore";
import { firestoreConverter } from "../utils/converter";
config();

const userFirstoreConverter = firestoreConverter<UserModel>();
export class User {
  collectionRef: CollectionReference<UserModel>;
  constructor() {
    this.collectionRef = db
      .collection(COLLECTIONS.users)
      .withConverter(userFirstoreConverter);
  }
  async create(
    data: UserModel,
    customUserId: UserId
  ): Promise<WithId<UserModel>> {
    await this.collectionRef
      .doc(customUserId)
      .withConverter(userFirstoreConverter)
      .set(data);
    return { ...data, id: customUserId };
  }
  update(id: UserId, data: Partial<UserModel>, batch: WriteBatch) {
    const docRef = this.collectionRef
      .doc(id)
      .withConverter(userFirstoreConverter);
    return batch.set(docRef, data, { merge: true });
  }
  async get(id: UserId) {
    const userDocRef = this.collectionRef
      .doc(id)
      .withConverter(userFirstoreConverter);

    const documentSnapshot = await userDocRef.get();
    if (documentSnapshot.exists) {
      const rawData = documentSnapshot.data();
      return rawData ? { ...rawData, id } : undefined;
    } else {
      return undefined;
    }
  }
  async getByIds(ids: UserId[]) {
    return await Promise.all(ids.map(async (id) => await this.get(id)));
  }
  async findOneBy(fieldName: "mobile" | "email", fieldValue: string) {
    const snapshot = await this.collectionRef
      .where("isActive", "==", true)
      .where(fieldName, "==", fieldValue)
      .get();
    const data = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    return data[0];
  }
  async findAll() {
    const snapshot = await this.collectionRef.get();
    const data = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    return data;
  }
  async softDelete(id: UserId, updatedBy: UserId) {
    const now = new Date();
    return await this.collectionRef.doc(id).set(
      {
        isDeleted: true,
        isActive: false,
        updatedBy,
        updatedAt: now,
        deletedBy: updatedBy,
        deletedAt: now,
      },
      { merge: true }
    );
  }
}
