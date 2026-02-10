import { COLLECTIONS, Shop as ShopModel, ShopId, UserId, WithId } from "@pos/shared-models";
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

const shopFirestoreConverter = firestoreConverter<ShopModel>();
type omitKeys =
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";
type AddData = WithId<Omit<ShopModel, omitKeys>>;
type EditData = Omit<ShopModel, omitKeys | "qty"> & { qty: number | FieldValue };

export class Shop {
  collectionRef: CollectionReference;
  constructor(db: Firestore) {
    this.collectionRef = collection(db, COLLECTIONS.shops);
  }
  add(batch: WriteBatch, data: AddData, createdBy: UserId) {
    const now = serverTimestamp();
    const { id, ...rest } = data;
    const docRef = !id
      ? doc(this.collectionRef).withConverter(shopFirestoreConverter)
      : doc(this.collectionRef, id).withConverter(shopFirestoreConverter);
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
  async get(id: ShopId) {
    const docRef = doc(this.collectionRef, id).withConverter(shopFirestoreConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id };
    } else {
      throw new Error(`Invalid shop ID #${id}`);
    }
  }
  async getListByIds(ids: ShopId[]) {
    return ids.length ? await Promise.all(ids?.map(async (id) => await this.get(id))) : [];
  }
  edit(batch: WriteBatch, id: ShopId, data: Partial<EditData>, updatedBy: UserId) {
    const now = serverTimestamp();
    const docRef = doc(this.collectionRef, id).withConverter(shopFirestoreConverter);
    batch.update(docRef, {
      ...data,
      updatedBy,
      updatedAt: now,
    });
  }
  remove(batch: WriteBatch, id: ShopId, deletedBy: UserId) {
    const now = serverTimestamp();
    const docRef = doc(this.collectionRef, id).withConverter(shopFirestoreConverter);
    batch.update(docRef, {
      isDeleted: true,
      deletedAt: now,
      deletedBy,
      updatedBy: deletedBy,
      updatedAt: now,
    });
  }
  restore(batch: WriteBatch, id: ShopId, updatedBy: UserId) {
    const now = serverTimestamp();
    const docRef = doc(this.collectionRef, id).withConverter(shopFirestoreConverter);
    batch.update(docRef, {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      updatedBy,
      updatedAt: now,
    });
  }
}
