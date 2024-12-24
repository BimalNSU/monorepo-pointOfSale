import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

export const firestoreConverter = <T extends object>(): FirestoreDataConverter<T> => ({
  toFirestore(data: T): DocumentData {
    return { ...data };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => {
        if (v instanceof Timestamp) {
          return [k, v.toDate()];
        } else {
          return [k, v];
        }
      }),
    ) as T;
  },
});

export const isDate = (str: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new Date(str) !== "Invalid Date" && !isNaN(new Date(str));
};

export const replacerFromString = (key: any, value: any) => {
  if (typeof value === "string" && isDate(value)) {
    return new Date(value);
  }
  return value;
};

// use case
// const data = useMemo(() => cbills.map(cbill => cbillToUI(cbill)), [cbills])
