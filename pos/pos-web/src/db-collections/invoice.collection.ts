import { COLLECTIONS } from "@pos/shared-models";
import { InvoiceId, UserId, WithId, Invoice as InvoiceModel } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import {
  CollectionReference,
  Firestore,
  Timestamp,
  WriteBatch,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

const invoiceFirestoreConverter = firestoreConverter<InvoiceModel>();
type omitKeys = "createdAt" | "createdBy" | "updatedAt" | "updatedBy";
type RData = Omit<InvoiceModel, omitKeys | "isDeleted" | "deletedAt" | "deletedBy">;
type EditData = Omit<InvoiceModel, omitKeys>;

export class Invoice {
  collectionRef: CollectionReference;
  constructor(db: Firestore) {
    this.collectionRef = collection(db, COLLECTIONS.invoices);
  }
  add(
    batch: WriteBatch,
    data: RData,
    createdBy: UserId,
    customId?: InvoiceId,
  ): WithId<InvoiceModel> {
    const now = serverTimestamp();
    const newData = {
      ...data,
      // dueDate: Timestamp.fromDate(dueDate),
      createdAt: now,
      createdBy,
      updatedAt: now,
      updatedBy: createdBy,
      isDeleted: false, // default
      deletedAt: null,
      deletedBy: null,
    };
    const docRef = !customId
      ? doc(this.collectionRef).withConverter(invoiceFirestoreConverter)
      : doc(this.collectionRef, customId).withConverter(invoiceFirestoreConverter);
    batch.set(docRef, newData);
    return { ...newData, id: docRef.id };
  }
  async get(id: InvoiceId) {
    const docRef = doc(this.collectionRef, id).withConverter(invoiceFirestoreConverter);
    const snapShot = await getDoc(docRef);
    if (snapShot.exists()) {
      return { ...snapShot.data(), id };
    } else {
      throw new Error(`Invoice ID #${id} is not found`);
    }
  }
  edit(batch: WriteBatch, id: InvoiceId, data: Partial<EditData>, updatedBy: UserId) {
    const now = serverTimestamp();
    const docRef = doc(this.collectionRef, id).withConverter(invoiceFirestoreConverter);
    return batch.update(docRef, { ...data, updatedAt: now, updatedBy });
  }
  remove(batch: WriteBatch, id: InvoiceId, deletedBy: UserId) {
    const now = serverTimestamp();
    const docRef = doc(this.collectionRef, id).withConverter(invoiceFirestoreConverter);
    batch.set(
      docRef,
      {
        updatedBy: deletedBy,
        updatedAt: now,
        isDeleted: true,
        deletedBy,
        deletedAt: now,
      },
      { merge: true },
    );
  }
}
