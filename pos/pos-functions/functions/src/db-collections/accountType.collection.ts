import { db } from "../firebase";
import { config } from "dotenv";
import {
  AccountType as AccountTypeModel,
  WithId,
  COLLECTIONS,
  AccountTypeId,
} from "@pos/shared-models";
import { CollectionReference, WriteBatch } from "firebase-admin/firestore";
import { firestoreConverter } from "../utils/converter";
import { AppError } from "../AppError";
config();

const accountTypeFirestoreConverter = firestoreConverter<AccountTypeModel>();
export class AccountType {
  collectionRef: CollectionReference<AccountTypeModel>;
  constructor() {
    this.collectionRef = db
      .collection(COLLECTIONS.accountTypes)
      .withConverter(accountTypeFirestoreConverter);
  }
  create(batch: WriteBatch, data: AccountTypeModel, customId?: AccountTypeId) {
    const docRef = !customId
      ? this.collectionRef.doc()
      : this.collectionRef.doc(customId);
    batch.create(docRef, data);
    return { ...data, id: customId ? customId : docRef.id };
  }
  update(
    id: AccountTypeId,
    data: Partial<AccountTypeModel>,
    batch: WriteBatch
  ) {
    const docRef = this.collectionRef
      .doc(id)
      .withConverter(accountTypeFirestoreConverter);
    return batch.set(docRef, data, { merge: true });
  }
  async get(id: AccountTypeId) {
    const userDocRef = this.collectionRef
      .doc(id)
      .withConverter(accountTypeFirestoreConverter);

    const documentSnapshot = await userDocRef.get();
    if (documentSnapshot.exists) {
      const rawData = documentSnapshot.data();
      if (rawData) {
        return { ...rawData, id } as WithId<AccountTypeModel>;
      }
      throw new Error();
    } else {
      throw new AppError(401, `AccountType ID #${id} is not found`);
    }
  }
  async getByIds(ids: AccountTypeId[]) {
    return await Promise.all(ids.map(async (id) => await this.get(id)));
  }
}
