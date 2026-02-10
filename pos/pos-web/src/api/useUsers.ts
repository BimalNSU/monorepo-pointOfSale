import { COLLECTIONS } from "@pos/shared-models";
import { WithId, User } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import { collection, query, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { useMemo } from "react";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
const userFirestoreConverter = firestoreConverter<WithId<User>>();
type Filter = {
  role?: 1 | 2 | 3;
  isDeleted?: boolean;
};
export const useUsers = (filter?: Filter) => {
  const db = useFirestore();
  const conditions = Object.entries(filter ?? {})
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => where(key, "==", value));
  const userCollectionRef = collection(db, COLLECTIONS.users).withConverter(userFirestoreConverter);
  const queryInUser = query(userCollectionRef, ...conditions);
  // const { status, data } = useFirestoreCollectionData(
  //   isDeleted == undefined ? userCollectionRef : queryInUser,
  //   {
  //     idField: "id",
  //   },
  // );
  const { status, data } = useFirestoreCollectionData(queryInUser, {
    idField: "id",
  });
  const users = useMemo(
    () =>
      data?.map((u) => {
        const { createdAt, ...rest } = u;
        return {
          ...rest,
          fullName: `${u.firstName}${u.lastName ? ` ${u.lastName}` : ""}`,
          createdAt: dayjs(createdAt as Date).format(DATE_TIME_FORMAT),
        };
      }),
    [data],
  );
  return { status, data: users };
};
