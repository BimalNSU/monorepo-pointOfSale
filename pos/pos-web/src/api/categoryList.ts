import { COLLECTIONS } from "@/constants/collections";
import { WithId } from "@/models/common.model";
import { Category } from "@/models/category.model";
import { firestoreConverter } from "@/utils/converter";
import { collection, query, where } from "firebase/firestore";
import { useMemo } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
const categoryFirestoreConverter = firestoreConverter<WithId<Category>>();

export const useCategories = () => {
  const db = useFirestore();
  const productCollectionRef = collection(db, COLLECTIONS.products).withConverter(
    categoryFirestoreConverter,
  );
  const queryInCategories = query(productCollectionRef, where("isDeleted", "==", false));
  const { status, data: categories } = useFirestoreCollectionData(queryInCategories, {
    idField: "id",
  });
  const data = useMemo(() => categories?.map((p) => ({ ...p, key: p.id })) ?? [], [categories]);
  return { status, data };
};
