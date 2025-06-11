import { ActiveSession, ActiveSessionId, COLLECTIONS } from "@pos/shared-models";
import { UserId } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
const sessionFirestoreConverter = firestoreConverter<ActiveSession>();

export const useSession = (userId: UserId, id: ActiveSessionId) => {
  const db = useFirestore();
  const docRef = doc(
    db,
    COLLECTIONS.sessions,
    userId,
    COLLECTIONS.activeSessions,
    id,
  ).withConverter(sessionFirestoreConverter);
  const { status, data } = useFirestoreDocData(docRef, {
    idField: "id",
  });
  return { status, data };
};
