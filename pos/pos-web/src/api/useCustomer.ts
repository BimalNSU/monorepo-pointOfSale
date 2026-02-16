import { COLLECTIONS, CustomerId, Customer } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
const customerFirestoreConverter = firestoreConverter<Customer>();

export const useCustomer = (id: CustomerId) => {
  const db = useFirestore();
  const docRef = doc(db, COLLECTIONS.customers, id).withConverter(customerFirestoreConverter);
  const { status, data } = useFirestoreDocData(docRef, {
    idField: "id",
  });
  return { status, data };
};
