import { db } from "../firebase";
import { config } from "dotenv";
import {
  COLLECTIONS,
  TransactionId,
  Transaction as TransactionModel,
} from "@pos/shared-models";
import { CollectionReference, WriteBatch } from "firebase-admin/firestore";
import { firestoreConverter } from "../utils/converter";
import { monotonicFactory, ULIDFactory } from "ulid";
config();

const transactionFirestoreConverter = firestoreConverter<TransactionModel>();
export class Transaction {
  collectionRef: CollectionReference<TransactionModel>;
  generateUlid: ULIDFactory;
  constructor() {
    this.collectionRef = db
      .collection(COLLECTIONS.transactions)
      .withConverter(transactionFirestoreConverter);
    this.generateUlid = monotonicFactory(); // One generator instance
  }
  create(batch: WriteBatch, data: TransactionModel, customId?: TransactionId) {
    const docId = customId ?? this.generateUlid();
    const docRef = this.collectionRef.doc(docId);
    batch.create(docRef, data);
    return docRef;
  }
  async update(id: TransactionId, data: Partial<TransactionModel>) {
    return await this.collectionRef
      .doc(id)
      .withConverter(transactionFirestoreConverter)
      .set(data, { merge: true });
  }
  async get(id: TransactionId) {
    const userDocRef = this.collectionRef
      .doc(id)
      .withConverter(transactionFirestoreConverter);

    const documentSnapshot = await userDocRef.get();
    if (documentSnapshot.exists) {
      const rawData = documentSnapshot.data();
      return rawData ? { ...rawData, id } : undefined;
    } else {
      return undefined;
    }
  }
}
