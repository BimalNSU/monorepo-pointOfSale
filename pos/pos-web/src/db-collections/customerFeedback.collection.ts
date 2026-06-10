import {
  COLLECTIONS,
  CustomerFeedback as FeedbackModel,
  CustomerFeedbackId,
  UserId,
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

const feedbackFirestoreConverter = firestoreConverter<FeedbackModel>();
type omitKeys =
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";
type AddData = WithId<Omit<FeedbackModel, omitKeys>>;

export class CustomerFeedback {
  collectionRef: CollectionReference;
  constructor(db: Firestore) {
    this.collectionRef = collection(db, COLLECTIONS.customerFeedbacks);
  }
  add(batch: WriteBatch, data: AddData, createdBy: UserId) {
    const now = serverTimestamp();
    const { id, ...rest } = data;
    const docRef = !id
      ? doc(this.collectionRef).withConverter(feedbackFirestoreConverter)
      : doc(this.collectionRef, id).withConverter(feedbackFirestoreConverter);
    batch.set(docRef, {
      ...rest,
      createdAt: now,
      createdBy,
      updatedAt: now,
      updatedBy: createdBy,
      isDeleted: false, // default
      deletedAt: null,
      deletedBy: null,
    });
    return docRef;
  }
  async get(id: CustomerFeedbackId) {
    const docRef = doc(this.collectionRef, id).withConverter(feedbackFirestoreConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id };
    } else {
      throw new Error(`Invalid feedback ID #${id}`);
    }
  }
  // async getListByIds(ids: CustomerFeedbackId[]) {
  //   return ids.length ? await Promise.all(ids?.map(async (id) => await this.get(id))) : [];
  // }

  // remove(batch: WriteBatch, id: CustomerFeedbackId, deletedBy: UserId) {
  //   const now = serverTimestamp();
  //   const docRef = doc(this.collectionRef, id).withConverter(feedbackFirestoreConverter);
  //   batch.update(docRef, {
  //     isDeleted: true,
  //     deletedAt: now,
  //     deletedBy,
  //     updatedBy: deletedBy,
  //     updatedAt: now,
  //   });
  // }
  // restore(batch: WriteBatch, id: CustomerFeedbackId, updatedBy: UserId) {
  //   const now = serverTimestamp();
  //   const docRef = doc(this.collectionRef, id).withConverter(feedbackFirestoreConverter);
  //   batch.update(docRef, {
  //     isDeleted: false,
  //     deletedAt: null,
  //     deletedBy: null,
  //     updatedBy,
  //     updatedAt: now,
  //   });
  // }
}
