import { COLLECTIONS, ShopId, Shop } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
const shopFirestoreConverter = firestoreConverter<Shop>();

export const useShop = (id: ShopId) => {
  const db = useFirestore();
  const docRef = doc(db, COLLECTIONS.shops, id).withConverter(shopFirestoreConverter);
  const { status, data } = useFirestoreDocData(docRef, {
    idField: "id",
  });
  return { status, data };
};
