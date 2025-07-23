import { db } from "../firebase";
import { config } from "dotenv";
import {
  Product as ProductModel,
  WithId,
  COLLECTIONS,
  ProductId,
} from "@pos/shared-models";
import { CollectionReference, WriteBatch } from "firebase-admin/firestore";
import { firestoreConverter } from "../utils/converter";
import { AppError } from "../utils/AppError";
config();

const productFirestoreConverter = firestoreConverter<ProductModel>();
export class Product {
  collectionRef: CollectionReference<ProductModel>;
  constructor() {
    this.collectionRef = db
      .collection(COLLECTIONS.products)
      .withConverter(productFirestoreConverter);
  }
  create(batch: WriteBatch, data: ProductModel, customId?: ProductId) {
    const docRef = !customId
      ? this.collectionRef.doc()
      : this.collectionRef.doc(customId);
    batch.create(docRef, data);
    return { ...data, id: customId ? customId : docRef.id };
  }
  update(id: ProductId, data: Partial<ProductModel>, batch: WriteBatch) {
    const docRef = this.collectionRef
      .doc(id)
      .withConverter(productFirestoreConverter);
    return batch.set(docRef, data, { merge: true });
  }
  async get(id: ProductId) {
    const userDocRef = this.collectionRef
      .doc(id)
      .withConverter(productFirestoreConverter);

    const documentSnapshot = await userDocRef.get();
    if (documentSnapshot.exists) {
      const rawData = documentSnapshot.data();
      if (rawData) {
        return { ...rawData, id } as WithId<ProductModel>;
      }
      throw new Error();
    } else {
      throw new AppError(`Product ID #${id} is not found`, 401);
    }
  }
  async getByIds(ids: ProductId[]) {
    return await Promise.all(ids.map(async (id) => await this.get(id)));
  }
}
