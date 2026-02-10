import { COLLECTIONS, Shop, WithId } from "@pos/shared-models";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import { firestoreConverter } from "@/utils/converter";
import dayjs from "dayjs";
import { collection, query, where } from "firebase/firestore";
import { useMemo } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
const shopFirestoreConverter = firestoreConverter<WithId<Shop>>();

export const useShops = () => {
  const db = useFirestore();
  const collectionRef = collection(db, COLLECTIONS.shops).withConverter(shopFirestoreConverter);
  const queryInShops = query(collectionRef, where("isDeleted", "==", false));
  const { status, data: shops } = useFirestoreCollectionData(queryInShops, {
    idField: "id",
  });
  const data = useMemo(
    () =>
      shops?.map((p) => {
        const { createdAt, ...rest } = p;
        return { ...rest, createdAt: dayjs(createdAt as Date).format(DATE_TIME_FORMAT) };
      }) ?? [],
    [shops],
  );
  return { status, data };
};
