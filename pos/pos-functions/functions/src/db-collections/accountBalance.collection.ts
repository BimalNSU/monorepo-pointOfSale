import { db } from "../firebase";
import { config } from "dotenv";
import {
  AccountBalance as AccountBalanceModel,
  WithId,
  COLLECTIONS,
  ChartOfAccountId,
  AccountBalanceId,
} from "@pos/shared-models";
import { CollectionReference, WriteBatch } from "firebase-admin/firestore";
import { firestoreConverter } from "../utils/converter";
config();

const accountBalanceFirestoreConverter =
  firestoreConverter<AccountBalanceModel>();
export class AccountBalance {
  collectionRef: CollectionReference<AccountBalanceModel>;
  constructor() {
    this.collectionRef = db
      .collection(COLLECTIONS.accountBalances)
      .withConverter(accountBalanceFirestoreConverter);
  }
  set(
    batch: WriteBatch,
    data: AccountBalanceModel,
    customId: ChartOfAccountId
  ) {
    const docRef = this.collectionRef.doc(customId);
    batch.set(docRef, data, { merge: true });
    return { ...data, id: customId };
  }
  update(
    id: AccountBalanceId,
    data: Partial<AccountBalanceModel>,
    batch: WriteBatch
  ) {
    const docRef = this.collectionRef
      .doc(id)
      .withConverter(accountBalanceFirestoreConverter);
    return batch.set(docRef, data, { merge: true });
  }
  async get(id: AccountBalanceId) {
    const userDocRef = this.collectionRef
      .doc(id)
      .withConverter(accountBalanceFirestoreConverter);

    const documentSnapshot = await userDocRef.get();
    if (documentSnapshot.exists) {
      const rawData = documentSnapshot.data();
      if (rawData) {
        return { ...rawData, id } as WithId<AccountBalanceModel>;
      }
    }
    return;
  }
  async getByIds(ids: ChartOfAccountId[]) {
    return await Promise.all(ids.map(async (id) => await this.get(id)));
  }
}
