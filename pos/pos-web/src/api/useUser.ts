import { COLLECTIONS } from "@pos/shared-models";
import { UserId } from "@pos/shared-models/dist/models/common.model";
import { User } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
const userFirestoreConverter = firestoreConverter<User>();

export const useUser = (id: UserId) => {
  const db = useFirestore();
  const docRef = doc(db, COLLECTIONS.users, id).withConverter(userFirestoreConverter);
  const { status, data } = useFirestoreDocData(docRef, {
    idField: "id",
  });
  return { status, data };
};
