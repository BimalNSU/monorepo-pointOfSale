import { COLLECTIONS } from "@/constants/collections";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import { WithId } from "@/models/common.model";
import { Invoice } from "@/models/invoice.model";
import { firestoreConverter } from "@/utils/converter";
import dayjs from "dayjs";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useMemo } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

const invoiceConverter = firestoreConverter<WithId<Invoice>>();

export const useInvoices = () => {
  const db = useFirestore();
  const queryInInvoices = query(
    collection(db, COLLECTIONS.invoices),
    where("isDeleted", "==", false),
    orderBy("createdAt", "desc"),
  ).withConverter(invoiceConverter);
  const { status, data: invoices } = useFirestoreCollectionData(queryInInvoices, { idField: "id" });
  const data = useMemo(
    () =>
      invoices?.map((inv) => {
        const { createdAt, ...rest } = inv;
        return { ...rest, createdAt: dayjs(createdAt).format(DATE_TIME_FORMAT), key: inv.id };
      }) ?? [],
    [invoices],
  );
  return { status, data };
};
