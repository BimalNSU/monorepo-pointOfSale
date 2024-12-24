import { COLLECTIONS } from "@/constants/collections";
import { DocumentCounterId, ProductId, PropertyId, UserId, WithId } from "@/models/common.model";
import { DocumentCounter as DocumentCounterModel } from "@/models/documentCounter.model";
import { Product as ProductModel } from "@/models/product.model";
import { firestoreConverter } from "@/utils/converter";
import {
  CollectionReference,
  FieldValue,
  Firestore,
  WriteBatch,
  collection,
  doc,
  getDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

const counterFirestoreConverter = firestoreConverter<DocumentCounterModel>();

export class DocumentCounter {
  collectionRef: CollectionReference;
  constructor(db: Firestore) {
    this.collectionRef = collection(db, COLLECTIONS.documentCounters);
  }
  incrementCounter(batch: WriteBatch, id: DocumentCounterId) {
    const docRef = doc(this.collectionRef, id);
    // .withConverter(counterFirestoreConverter);
    batch.update(docRef, {
      count: increment(1),
    });
    return docRef;
  }
  async get(id: DocumentCounterId) {
    const docRef = doc(this.collectionRef, id).withConverter(counterFirestoreConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id };
    } else {
      throw new Error(`Invalid document counter ID: ${id}`);
    }
  }
}
