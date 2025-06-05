import { COLLECTIONS } from "@pos/shared-models";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import { WithId } from "@pos/shared-models/dist/models/common.model";
import { Invoice } from "@pos/shared-models/dist/models/invoice.model";
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

const invoiceConverter = firestoreConverter<WithId<Invoice>>();

export const useInvoicesPaginated = (pageSize: number = 10) => {
  const [pageNo, setPageNo] = useState<number>(1);
  const [hasPreviousePage, setHasPreviousPage] = useState<boolean>();
  const [hasNextPage, setHasNextPage] = useState<boolean>();
  const [invoices, setInvoices] =
    useState<WithId<Omit<Invoice, "createdAt"> & { createdAt: string }>[]>();
  const [firstSnapshot, setFirstSnapshot] = useState<DocumentSnapshot | null>();
  const [lastSnapshot, setLastSnapshot] = useState<DocumentSnapshot | null>();
  const db = useFirestore();

  // Default query for the first page
  const defaultQueryInInvoices = query(
    collection(db, COLLECTIONS.invoices).withConverter(invoiceConverter),
    where("isDeleted", "==", false),
    orderBy("createdAt", "desc"),
    limit(pageSize),
  );
  const [queryRef, setQueryRef] = useState(defaultQueryInInvoices);

  useEffect(() => {
    setPageNo(1);
    setLastSnapshot(null);
    const nextQuery = query(
      collection(db, COLLECTIONS.invoices).withConverter(invoiceConverter),
      where("isDeleted", "==", false),
      orderBy("createdAt", "desc"),
      limit(pageSize),
    );
    setQueryRef(nextQuery);
  }, [pageSize]);

  const { status, data: invoiceSnapshots } = useFirestoreCollection(queryRef, { idField: "id" });

  useEffect(() => {
    if (!invoiceSnapshots || invoiceSnapshots.empty) {
      //#region: rollback to previous page
      if (pageNo > 1 && !invoiceSnapshots?.docs.length) {
        setPageNo((prev) => prev - 1);
      }
      setInvoices([]);
      setHasNextPage(false);
      //#endregion
    } else {
      const firstDoc = invoiceSnapshots.docs[0];
      const lastDoc = invoiceSnapshots.docs[invoiceSnapshots.docs.length - 1];

      setFirstSnapshot(firstDoc);
      setLastSnapshot(lastDoc);
      setHasNextPage(invoiceSnapshots.docs.length === pageSize);
      setHasPreviousPage(pageNo > 1);

      const formattedInvoices =
        invoiceSnapshots?.docs.map((inv) => {
          const { createdAt, ...rest } = inv.data();
          return {
            ...rest,
            createdAt: dayjs(createdAt as Date).format(DATE_TIME_FORMAT),
            id: inv.id,
            key: inv.id,
          };
        }) ?? [];
      setInvoices(formattedInvoices);
    }
  }, [invoiceSnapshots]);

  const metaData = useMemo(() => {
    return { pageNo, pageSize };
  }, [pageNo, pageSize]);

  const handleNextPage = () => {
    if (!hasNextPage) return;
    setPageNo((prev) => prev + 1);

    const nextQuery = query(
      collection(db, COLLECTIONS.invoices).withConverter(invoiceConverter),
      where("isDeleted", "==", false),
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
      collection(db, COLLECTIONS.invoices).withConverter(invoiceConverter),
      where("isDeleted", "==", false),
      orderBy("createdAt", "desc"),
      endBefore(firstSnapshot), // ✅ Corrected: Passing a valid DocumentSnapshot
      limitToLast(pageSize),
    );
    setQueryRef(previousQueryRef);
  };

  return {
    status,
    data: invoices,
    metaData,
    hasPreviousePage,
    hasNextPage,
    handleNextPage,
    handlePreviousPage,
  };
};
