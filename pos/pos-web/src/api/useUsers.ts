import { COLLECTIONS } from "@pos/shared-models";
import { WithId, User } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import { collection, query, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { useMemo } from "react";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
const userFirestoreConverter = firestoreConverter<WithId<User>>();

export const useUsers = (isDeleted?: boolean) => {
  const db = useFirestore();
  const userCollectionRef = collection(db, COLLECTIONS.users).withConverter(userFirestoreConverter);
  const queryInUser = query(userCollectionRef, where("isDeleted", "==", isDeleted ?? false));
  const { status, data } = useFirestoreCollectionData(
    isDeleted == undefined ? userCollectionRef : queryInUser,
    {
      idField: "id",
    },
  );
  const users = useMemo(
    () =>
      data?.map((u) => {
        const { createdAt, ...rest } = u;
        return { ...rest, createdAt: dayjs(createdAt).format(DATE_TIME_FORMAT) };
      }),
    [data],
  );
  return { status, data: users };
};
