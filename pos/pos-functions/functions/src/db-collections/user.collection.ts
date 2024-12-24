import { db } from "../firebase";
import { config } from "dotenv";

import { COLLECTIONS } from "../constants/collections";
import { UserId } from "../models/common.model";
import { CollectionReference } from "firebase-admin/firestore";
import { firestoreConverter } from "../utils/converter";
import { User as UserModel } from "../models/user.model";
type omitType =
  | "createdBy"
  | "createdAt"
  | "updatedBy"
  | "updatedAt"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";
type ViewData = Omit<UserModel, omitType> & { id: UserId };
config();

const userFirstoreConverter = firestoreConverter<UserModel>();
export class User {
  collectionRef: CollectionReference<UserModel>;
  constructor() {
    this.collectionRef = db
      .collection(COLLECTIONS.users)
      .withConverter(userFirstoreConverter);
  }
  async create(data: UserModel, customUserId: UserId): Promise<ViewData> {
    await this.collectionRef
      .doc(customUserId)
      .withConverter(userFirstoreConverter)
      .set(data);
    const filterData = this.filterDocData(data);
    return { ...filterData, id: customUserId };
  }
  async update(id: UserId, data: Partial<UserModel>) {
    const now = new Date();
    return await this.collectionRef
      .doc(id)
      .withConverter(userFirstoreConverter)
      .set({ ...data, updatedAt: now }, { merge: true });
  }
  async get(id: UserId) {
    const userDocRef = this.collectionRef
      .doc(id)
      .withConverter(userFirstoreConverter);

    const documentSnapshot = await userDocRef.get();
    if (documentSnapshot.exists) {
      const rawData = documentSnapshot.data();
      return rawData ? { ...this.filterDocData(rawData), id } : undefined;
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
      const filterData = this.filterDocData(doc.data());
      return { ...filterData, id: doc.id };
    });
    return data[0];
  }
  async findAll() {
    const snapshot = await this.collectionRef.get();
    const data = snapshot.docs.map((doc) => {
      const filterData = this.filterDocData(doc.data());
      return { ...filterData, id: doc.id };
    });
    return data;
  }
  private filterDocData(data: UserModel) {
    const {
      createdAt,
      createdBy,
      updatedAt,
      updatedBy,
      isDeleted,
      deletedAt,
      deletedBy,
      ...rest
    } = data;
    return rest;
  }
}
