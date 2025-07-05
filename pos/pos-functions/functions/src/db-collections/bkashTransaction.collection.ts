import { db } from "../firebase";
import { config } from "dotenv";
import {
  COLLECTIONS,
  BkashTransaction as BkashTransactionModel,
  BkashTransactionId,
} from "@pos/shared-models";
import { CollectionReference } from "firebase-admin/firestore";
import { firestoreConverter } from "../utils/converter";

config();

const bkashTransactionFirstoreConverter =
  firestoreConverter<BkashTransactionModel>();
export class BkashTransaction {
  collectionRef: CollectionReference;
  constructor() {
    this.collectionRef = db.collection(COLLECTIONS.bkashTransactions);
  }
  async create(data: BkashTransactionModel, id: BkashTransactionId) {
    const docRef = this.collectionRef
      .doc(id)
      .withConverter(bkashTransactionFirstoreConverter);
    await docRef.set(data);
    return docRef;
  }
}
