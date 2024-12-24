import { COLLECTIONS } from "@/constants/collections";
import { ProductId, PropertyId, UserId, WithId } from "@/models/common.model";
import { Product as ProductModel } from "@/models/product.model";
import { firestoreConverter } from "@/utils/converter";
import {
  CollectionReference,
  FieldValue,
  Firestore,
  WriteBatch,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

const productFirestoreConverter = firestoreConverter<ProductModel>();
type omitKeys =
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";
type AddData = WithId<Omit<ProductModel, omitKeys>>;
type EditData = Omit<ProductModel, omitKeys | "qty"> & { qty: number | FieldValue };

export class Product {
  collectionRef: CollectionReference;
  constructor(db: Firestore) {
    this.collectionRef = collection(db, COLLECTIONS.products);
  }
  add(batch: WriteBatch, data: AddData, createdBy: UserId) {
    const now = serverTimestamp();
    const { id, ...rest } = data;
    const docRef = !id
      ? doc(this.collectionRef).withConverter(productFirestoreConverter)
      : doc(this.collectionRef, id).withConverter(productFirestoreConverter);
    batch.set(docRef, {
      ...rest,
      createdAt: now,
      createdBy,
      updatedAt: now,
      updatedBy: createdBy,
      isDeleted: false, // default
      deletedAt: null,
      deletedBy: null,
    });
    return docRef;
  }
  async get(id: PropertyId) {
    const docRef = doc(this.collectionRef, id).withConverter(productFirestoreConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id };
    } else {
      throw new Error(`Invalid propertyId: ${id}`);
    }
  }
  async getListByIds(ids: ProductId[]) {
    return ids.length ? await Promise.all(ids?.map(async (id) => await this.get(id))) : [];
  }
  edit(batch: WriteBatch, id: ProductId, data: Partial<EditData>, updatedBy: UserId) {
    const now = serverTimestamp();
    const docRef = doc(this.collectionRef, id).withConverter(productFirestoreConverter);
    batch.update(docRef, {
      ...data,
      updatedBy,
      updatedAt: now,
    });
  }
  remove(batch: WriteBatch, id: ProductId, deletedBy: UserId) {
    const now = serverTimestamp();
    const docRef = doc(this.collectionRef, id).withConverter(productFirestoreConverter);
    batch.update(docRef, {
      isDeleted: true,
      deletedAt: now,
      deletedBy,
      updatedBy: deletedBy,
      updatedAt: now,
    });
  }
}
