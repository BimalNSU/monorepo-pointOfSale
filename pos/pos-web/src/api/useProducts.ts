import { COLLECTIONS } from "@/constants/collections";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import { WithId } from "@/models/common.model";
import { Product } from "@/models/product.model";
import { firestoreConverter } from "@/utils/converter";
import dayjs from "dayjs";
import { collection, query, where } from "firebase/firestore";
import { useMemo } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
const userFirestoreConverter = firestoreConverter<WithId<Product>>();

export const useProducts = () => {
  const db = useFirestore();
  const productCollectionRef = collection(db, COLLECTIONS.products).withConverter(
    userFirestoreConverter,
  );
  const queryInProducts = query(productCollectionRef, where("isDeleted", "==", false));
  const { status, data: products } = useFirestoreCollectionData(queryInProducts, {
    idField: "id",
  });
  const data = useMemo(
    () =>
      products?.map((p) => {
        const { createdAt, ...rest } = p;
        return { ...rest, createdAt: dayjs(createdAt).format(DATE_TIME_FORMAT) };
      }) ?? [],
    [products],
  );
  return { status, data };
};
