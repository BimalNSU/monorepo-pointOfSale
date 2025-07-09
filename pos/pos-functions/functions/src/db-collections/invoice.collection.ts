import { db } from "../firebase";
import { config } from "dotenv";
import { COLLECTIONS } from "../constants/collections";
import { Invoice as InvoiceModel, InvoiceId } from "@pos/shared-models";
import { CollectionReference, WriteBatch } from "firebase-admin/firestore";
import { firestoreConverter } from "../utils/converter";
config();

const invoiceFirestoreConverter = firestoreConverter<InvoiceModel>();
export class Invoice {
  collectionRef: CollectionReference<InvoiceModel>;
  constructor() {
    this.collectionRef = db
      .collection(COLLECTIONS.invoices)
      .withConverter(invoiceFirestoreConverter);
  }
  create(batch: WriteBatch, data: InvoiceModel, customId?: InvoiceId) {
    const docRef = !customId
      ? this.collectionRef.doc()
      : this.collectionRef.doc(customId);
    batch.create(docRef, data);
    return { ...data, id: customId ? customId : docRef.id };
  }
  async update(id: InvoiceId, data: Partial<InvoiceModel>) {
    return await this.collectionRef
      .doc(id)
      .withConverter(invoiceFirestoreConverter)
      .set(data, { merge: true });
  }
  async get(id: InvoiceId) {
    const userDocRef = this.collectionRef
      .doc(id)
      .withConverter(invoiceFirestoreConverter);

    const documentSnapshot = await userDocRef.get();
    if (documentSnapshot.exists) {
      const rawData = documentSnapshot.data();
      return rawData ? { ...rawData, id } : undefined;
    } else {
      return undefined;
    }
  }
}
