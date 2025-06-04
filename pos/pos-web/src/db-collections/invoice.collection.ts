import { COLLECTIONS } from "@/constants/collections";
import { InvoiceId, UserId, WithId } from "@pos/shared-models/dist/models/common.model";
import { Invoice as InvoiceModel } from "@pos/shared-models/dist/models/invoice.model";
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
type omitKeys =
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";
type RData = Omit<InvoiceModel, omitKeys>;

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

  // //batch update
  // edit(batch: WriteBatch, id: InvoiceId, data: InvoiceMutableFields, updatedBy: UserId) {
  //   const now = serverTimestamp();
  //   const docRef = doc(this.collectionRef, id).withConverter(invoiceFirestoreConverter);
  //   const asMutPbill = data as InvoiceMutPBill;
  //   const asMutPayment = data as InvoiceMutPayment;
  //   if (asMutPbill.pBills) {
  //     const { pBillId, pBillNameId, amount } = asMutPbill.pBills;
  //     const amountPath = `pBills.${pBillId}.bills.${pBillNameId}.amount`;
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     batch.update(docRef, {
  //       [amountPath]: amount,
  //       updatedBy,
  //       updatedAt: now,
  //     });
  //   } else {
  //     batch.update(docRef, {
  //       ...asMutPayment,
  //       updatedBy,
  //       updatedAt: now,
  //     });
  //   }
  // }
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
