import { COLLECTIONS } from "@pos/shared-models";
import { ProductId, Product, WithId } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
const productFirestoreConverter = firestoreConverter<WithId<Product>>();

export const useProduct = (id: ProductId) => {
  const db = useFirestore();
  const productDocRef = doc(db, COLLECTIONS.products, id).withConverter(productFirestoreConverter);
  const { status, data } = useFirestoreDocData(productDocRef, {
    idField: "id",
  });
  return { status, data };
};
