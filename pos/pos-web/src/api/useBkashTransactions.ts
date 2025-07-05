import { BkashTransaction, COLLECTIONS } from "@pos/shared-models";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import { WithId, Product } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import dayjs from "dayjs";
import {
  collection,
  DocumentSnapshot,
  endBefore,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useFirestore, useFirestoreCollection } from "reactfire";
const transactionFirestoreConverter = firestoreConverter<WithId<BkashTransaction>>();

export const useBkashTransactions = (pageSize: number = 10) => {
  const [pageNo, setPageNo] = useState<number>(1);
  const [hasPreviousePage, setHasPreviousPage] = useState<boolean>();
  const [hasNextPage, setHasNextPage] = useState<boolean>();
  const [bkashTransactions, setBkashTransactions] =
    useState<WithId<Omit<BkashTransaction, "createdAt"> & { createdAt: string }>[]>();
  const [firstSnapshot, setFirstSnapshot] = useState<DocumentSnapshot | null>();
  const [lastSnapshot, setLastSnapshot] = useState<DocumentSnapshot | null>();

  const db = useFirestore();
  // Default query for the first page
  const defaultQueryInTransaction = query(
    collection(db, COLLECTIONS.bkashTransactions).withConverter(transactionFirestoreConverter),
    // where("isDeleted", "==", false),
    orderBy("createdAt", "desc"),
    limit(pageSize),
  );
  const [queryRef, setQueryRef] = useState(defaultQueryInTransaction);
  useEffect(() => {
    setPageNo(1);
    setLastSnapshot(null);
    const nextQuery = query(
      collection(db, COLLECTIONS.bkashTransactions).withConverter(transactionFirestoreConverter),
      //   where("isDeleted", "==", false),
      orderBy("createdAt", "desc"),
      limit(pageSize),
    );
    setQueryRef(nextQuery);
  }, [pageSize]);

  const { status, data: bTransactionSnapshots } = useFirestoreCollection(queryRef, {
    idField: "id",
  });
  useEffect(() => {
    if (!bTransactionSnapshots || bTransactionSnapshots.empty) {
      //#region: rollback to previous page
      if (pageNo > 1 && !bTransactionSnapshots?.docs.length) {
        setPageNo((prev) => prev - 1);
      }
      setBkashTransactions([]);
      setHasNextPage(false);
      //#endregion
    } else {
      const firstDoc = bTransactionSnapshots.docs[0];
      const lastDoc = bTransactionSnapshots.docs[bTransactionSnapshots.docs.length - 1];

      setFirstSnapshot(firstDoc);
      setLastSnapshot(lastDoc);
      setHasNextPage(bTransactionSnapshots.docs.length === pageSize);
      setHasPreviousPage(pageNo > 1);

      const formattedTransactions =
        bTransactionSnapshots?.docs.map((t) => {
          const { createdAt, ...rest } = t.data();
          return {
            ...rest,
            createdAt: dayjs(createdAt as Date).format(DATE_TIME_FORMAT),
            id: t.id,
            key: t.id,
          };
        }) ?? [];
      setBkashTransactions(formattedTransactions);
    }
  }, [bTransactionSnapshots]);
  const metaData = useMemo(() => {
    return { pageNo, pageSize };
  }, [pageNo, pageSize]);

  const handleNextPage = () => {
    if (!hasNextPage) return;
    setPageNo((prev) => prev + 1);

    const nextQuery = query(
      collection(db, COLLECTIONS.bkashTransactions).withConverter(transactionFirestoreConverter),
      // where("isDeleted", "==", false),
      orderBy("createdAt", "desc"),
      startAfter(lastSnapshot), // ✅ Corrected: Passing a valid DocumentSnapshot
      limit(pageSize),
    );
    setQueryRef(nextQuery);
  };
  const handlePreviousPage = () => {
    if (!hasPreviousePage) return;
    setPageNo((prev) => prev - 1);

    const previousQueryRef = query(
      collection(db, COLLECTIONS.bkashTransactions).withConverter(transactionFirestoreConverter),
      // where("isDeleted", "==", false),
      orderBy("createdAt", "desc"),
      endBefore(firstSnapshot), // ✅ Corrected: Passing a valid DocumentSnapshot
      limitToLast(pageSize),
    );
    setQueryRef(previousQueryRef);
  };

  return {
    status,
    data: bkashTransactions,
    metaData,
    hasPreviousePage,
    hasNextPage,
    handleNextPage,
    handlePreviousPage,
  };
};
