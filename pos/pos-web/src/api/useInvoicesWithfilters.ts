import { COLLECTIONS } from "@pos/shared-models";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import { WithId } from "@pos/shared-models/dist/models/common.model";
import { Invoice } from "@pos/shared-models/dist/models/invoice.model";
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
          createdAt: dayjs(createdAt as Date).format(DATE_TIME_FORMAT),
          key: inv.id,
        };
      }) ?? [],
    [invoices],
  );
  return { status, data };
};
