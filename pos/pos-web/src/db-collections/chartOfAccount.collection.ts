import {
  COLLECTIONS,
  ChartOfAccount as ChartOfAccountModel,
  ChartOfAccountId,
  WithId,
} from "@pos/shared-models";
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

const accountFirestoreConverter = firestoreConverter<ChartOfAccountModel>();
type omitKeys =
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";
type MutableData = WithId<Omit<ChartOfAccountModel, omitKeys>>;

export class ChartOfAccount {
  collectionRef: CollectionReference;
  constructor(db: Firestore) {
    this.collectionRef = collection(db, COLLECTIONS.chartOfAccounts);
  }
  async get(id: ChartOfAccountId) {
    const docRef = doc(this.collectionRef, id).withConverter(accountFirestoreConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        id,
      };
    } else {
      throw new Error(`ChartOfAccount ID ${id} is invalid`);
    }
  }
  async getByIds(ids: ChartOfAccountId[]) {
    return await Promise.all(ids.map(async (id) => await this.get(id)));
  }
}
