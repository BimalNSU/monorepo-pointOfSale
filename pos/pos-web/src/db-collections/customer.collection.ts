import { COLLECTIONS, CustomerId } from "@pos/shared-models";
import { UserId, WithId, Customer as CustomerModel } from "@pos/shared-models";
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
const customerFirestoreConverter = firestoreConverter<CustomerModel>();
type omitKeys = "createdAt" | "createdBy" | "updatedAt" | "isDeleted" | "deletedAt" | "deletedBy";
type AddData = Omit<
  CustomerModel,
  "createdAt" | "updatedAt" | "isDeleted" | "deletedAt" | "deletedBy"
>;
type EditData = Omit<CustomerModel, omitKeys>;
export class Customer {
  db: Firestore;
  collectionRef: CollectionReference;
  constructor(db: Firestore) {
    this.db = db;
    this.collectionRef = collection(db, COLLECTIONS.customers);
  }
  add(data: WithId<AddData>, batch: WriteBatch) {
    const now = serverTimestamp();
    const { id, ...rest } = data;
    const docRef = !id
      ? doc(this.collectionRef).withConverter(customerFirestoreConverter)
      : doc(this.collectionRef, id).withConverter(customerFirestoreConverter);
    batch.set(docRef, {
      ...rest,
      createdAt: now,
      updatedAt: now,
      isDeleted: false, // default
      deletedAt: null,
      deletedBy: null,
    });
    return docRef;
  }
  async get(id: CustomerId) {
    const docRef = doc(this.db, COLLECTIONS.customers, id).withConverter(
      customerFirestoreConverter,
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        id,
      };
    } else {
      throw new Error(`Invalid customer id ${id}`);
    }
  }
  async getListByIds(customerIds: UserId[]) {
    return await Promise.all<WithId<CustomerModel>>(
      customerIds.map(async (id) => await this.get(id)),
    );
  }
  edit(batch: WriteBatch, id: CustomerId, data: Partial<EditData>) {
    const now = serverTimestamp();
    const docRef = doc(this.db, COLLECTIONS.customers, id).withConverter(
      customerFirestoreConverter,
    );
    batch.set(
      docRef,
      {
        ...data,
        updatedAt: now,
      },
      { merge: true },
    );
  }
  softDelete(batch: WriteBatch, id: CustomerId, deletedBy: UserId) {
    const now = serverTimestamp();
    const docRef = doc(this.db, COLLECTIONS.customers, id).withConverter(
      customerFirestoreConverter,
    );
    batch.set(
      docRef,
      {
        isDeleted: true,
        deletedAt: now,
        deletedBy,
        updatedAt: now,
        updatedBy: deletedBy,
      },
      { merge: true },
    );
  }
  restore(batch: WriteBatch, id: CustomerId, updatedBy: UserId) {
    const now = serverTimestamp();
    const docRef = doc(this.db, COLLECTIONS.customers, id).withConverter(
      customerFirestoreConverter,
    );
    batch.set(
      docRef,
      {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedAt: now,
        updatedBy,
      },
      { merge: true },
    );
  }
}
