import { COLLECTIONS, CustomerFeedback as FeedbackModel } from "@pos/shared-models";
import { WithId } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import { collection, query, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
const feedbackFirestoreConverter = firestoreConverter<WithId<FeedbackModel>>();
type Filter = {
  role?: 1 | 2 | 3;
  isDeleted?: boolean;
};
export const useCustomerFeedbacks = (filter?: Filter) => {
  const db = useFirestore();
  const conditions = Object.entries(filter ?? {})
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => where(key, "==", value));
  const customerCollectionRef = collection(db, COLLECTIONS.customerFeedbacks).withConverter(
    feedbackFirestoreConverter,
  );
  const queryInFeedback = query(customerCollectionRef, ...conditions);
  return useFirestoreCollectionData(queryInFeedback, {
    idField: "id",
  });
};
