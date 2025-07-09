import { db } from "../firebase";
import { config } from "dotenv";
import {
  ChartOfAccount as ChartOfAccountModel,
  WithId,
  COLLECTIONS,
  ChartOfAccountId,
} from "@pos/shared-models";
import { CollectionReference, WriteBatch } from "firebase-admin/firestore";
import { firestoreConverter } from "../utils/converter";
import { AppError } from "../AppError";
config();

const chartOfAccountFirestoreConverter =
  firestoreConverter<ChartOfAccountModel>();
export class ChartOfAccount {
  collectionRef: CollectionReference<ChartOfAccountModel>;
  constructor() {
    this.collectionRef = db
      .collection(COLLECTIONS.chartOfAccounts)
      .withConverter(chartOfAccountFirestoreConverter);
  }
  create(
    batch: WriteBatch,
    data: ChartOfAccountModel,
    customId?: ChartOfAccountId
  ) {
    const docRef = !customId
      ? this.collectionRef.doc()
      : this.collectionRef.doc(customId);
    batch.create(docRef, data);
    return { ...data, id: customId ? customId : docRef.id };
  }
  update(
    id: ChartOfAccountId,
    data: Partial<ChartOfAccountModel>,
    batch: WriteBatch
  ) {
    const docRef = this.collectionRef
      .doc(id)
      .withConverter(chartOfAccountFirestoreConverter);
    return batch.set(docRef, data, { merge: true });
  }
  async get(id: ChartOfAccountId) {
    const userDocRef = this.collectionRef
      .doc(id)
      .withConverter(chartOfAccountFirestoreConverter);

    const documentSnapshot = await userDocRef.get();
    if (documentSnapshot.exists) {
      const rawData = documentSnapshot.data();
      if (rawData) {
        return { ...rawData, id } as WithId<ChartOfAccountModel>;
      }
      throw new Error();
    } else {
      throw new AppError(401, `ChartOfAccount ID #${id} is not found`);
    }
  }
  async getByIds(ids: ChartOfAccountId[]) {
    return await Promise.all(ids.map(async (id) => await this.get(id)));
  }
}
