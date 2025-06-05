import { COLLECTIONS } from "@pos/shared-models";
import { InvoiceId, WithId } from "@pos/shared-models/dist/models/common.model";
import { Invoice } from "@pos/shared-models/dist/models/invoice.model";
import { firestoreConverter } from "@/utils/converter";
import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
const invoiceFirestoreConverter = firestoreConverter<WithId<Invoice>>();

export const useInvoice = (id: InvoiceId) => {
  const db = useFirestore();
  const docRef = doc(db, COLLECTIONS.invoices, id).withConverter(invoiceFirestoreConverter);
  const { status, data } = useFirestoreDocData(docRef, {
    idField: "id",
  });
  return { status, data };
};
