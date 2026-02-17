import { COLLECTIONS } from "@pos/shared-models";
import { WithId, Customer } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import { collection, query, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { useMemo } from "react";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
const customerFirestoreConverter = firestoreConverter<WithId<Customer>>();
type Filter = {
  role?: 1 | 2 | 3;
  isDeleted?: boolean;
};
export const useCustomers = (filter?: Filter) => {
  const db = useFirestore();
  const conditions = Object.entries(filter ?? {})
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => where(key, "==", value));
  const customerCollectionRef = collection(db, COLLECTIONS.customers).withConverter(
    customerFirestoreConverter,
  );
  const queryInCustomer = query(customerCollectionRef, ...conditions);

  const { status, data } = useFirestoreCollectionData(queryInCustomer, {
    idField: "id",
  });
  const customers = useMemo(
    () =>
      data?.map((u) => {
        const { createdAt, ...rest } = u;
        return {
          ...rest,
          // fullName: `${u.firstName}${u.lastName ? ` ${u.lastName}` : ""}`,
          createdAt: dayjs(createdAt as Date).format(DATE_TIME_FORMAT),
        };
      }),
    [data],
  );
  return { status, data: customers };
};
