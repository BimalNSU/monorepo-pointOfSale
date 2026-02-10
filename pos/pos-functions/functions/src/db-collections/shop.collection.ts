import { db } from "../firebase";
import { config } from "dotenv";
import {
  COLLECTIONS,
  Shop as ShopModel,
  ShopId,
  UserId,
} from "@pos/shared-models";
import {
  CollectionReference,
  FieldValue,
  WriteBatch,
} from "firebase-admin/firestore";
import { firestoreConverter } from "../utils/converter";

config();
type MutableData = Partial<Omit<ShopModel, "userId">>;
const shopFirestoreConverter = firestoreConverter<ShopModel>();
export class Shop {
  collectionRef: CollectionReference;
  constructor() {
    this.collectionRef = db.collection(COLLECTIONS.shops);
  }
  update(id: ShopId, data: MutableData, batch: WriteBatch) {
    const now = FieldValue.serverTimestamp();
    const docRef = this.collectionRef
      .doc(id)
      .withConverter(shopFirestoreConverter);
    return batch.set(docRef, { ...data, updatedAt: now }, { merge: true });
  }
  async get(id: ShopId) {
    const docRef = this.collectionRef
      .doc(id)
      .withConverter(shopFirestoreConverter);

    const documentSnapshot = await docRef.get();
    if (documentSnapshot.exists) {
      const rawData = documentSnapshot.data();
      return rawData ? { ...rawData, id } : undefined;
    } else {
      return undefined;
    }
  }
  softDelete(id: ShopId, deletedBy: UserId, batch: WriteBatch) {
    const now = FieldValue.serverTimestamp();
    this.update(
      id,
      {
        isDeleted: true,
        updatedBy: deletedBy,
        deletedAt: now,
        deletedBy,
      },
      batch,
    );
  }
}
