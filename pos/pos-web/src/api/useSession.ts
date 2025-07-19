import { Session, SessionId, COLLECTIONS } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
const sessionFirestoreConverter = firestoreConverter<Session>();

export const useSession = (id: SessionId) => {
  const db = useFirestore();
  const docRef = doc(db, COLLECTIONS.sessions, id).withConverter(sessionFirestoreConverter);
  const { status, data } = useFirestoreDocData(docRef, {
    idField: "id",
  });
  return { status, data };
};
