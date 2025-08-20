import { COLLECTIONS, WithId, Invoice } from "@pos/shared-models";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import { firestoreConverter } from "@/utils/converter";
import dayjs, { Dayjs } from "dayjs";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useMemo } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

const invoiceConverter = firestoreConverter<WithId<Invoice>>();

export const useInvoicesWithFilters = (dateRange?: { fromDate: Dayjs; toDate: Dayjs }) => {
  const db = useFirestore();
  const queryInInvoices = query(
    collection(db, COLLECTIONS.invoices),
    where("isDeleted", "==", false),
    ...(dateRange
      ? [
          where("createdAt", ">=", dateRange.fromDate.toDate()),
          where("createdAt", "<=", dateRange.toDate.toDate()),
        ]
      : []),
    orderBy("createdAt", "desc"),
  ).withConverter(invoiceConverter);
  const { status, data: invoices } = useFirestoreCollectionData(queryInInvoices, { idField: "id" });
  const data = useMemo(
    () =>
      invoices?.map((inv) => {
        const { createdAt, ...rest } = inv;
        return {
          ...rest,
          totalDiscount:
            (inv.specialDiscount || 0) +
            inv.items.reduce((pre, curr) => pre + (curr.discount || 0), 0),
          createdAt: dayjs(createdAt as Date).format(DATE_TIME_FORMAT),
          key: inv.id,
        };
      }) ?? [],
    [invoices],
  );
  return { status, data };
};
