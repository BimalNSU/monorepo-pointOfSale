import { COLLECTIONS } from "@pos/shared-models";
import { WithId } from "@pos/shared-models/dist/models/common.model";
import { User } from "@pos/shared-models/dist/models/user.model";
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
