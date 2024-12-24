import { COLLECTIONS } from "@/constants/collections";
import { WithId } from "@/models/common.model";
import { User } from "@/models/user.model";
import { firestoreConverter } from "@/utils/converter";
import { collection, query, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
const userFirestoreConverter = firestoreConverter<WithId<User>>();

export const useUsers = () => {
  const db = useFirestore();
  const userCollectionRef = collection(db, COLLECTIONS.users).withConverter(userFirestoreConverter);
  const queryInUser = query(userCollectionRef, where("isDeleted", "==", false));
  const { status, data } = useFirestoreCollectionData(queryInUser, {
    idField: "id",
  });
  return { status, data };
};
