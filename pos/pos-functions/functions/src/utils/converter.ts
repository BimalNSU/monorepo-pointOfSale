import { createReadStream } from "fs";
import csvParser from "csv-parser";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore";

export const firestoreConverter = <
  T extends object
>(): FirestoreDataConverter<T> => ({
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
      })
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

export const csvToJson = (filePath: string) => {
  return new Promise<{ [key: string]: any }[]>((resolve, reject) => {
    const csvData: { [key: string]: string }[] = [];
    createReadStream(filePath)
      // .pipe(csvParser({ delimiter: "/n", columns: true })) // Treat the first row as headers
      .pipe(csvParser())
      .on("data", (chunk) => {
        if (Object.keys(chunk).length) {
          csvData.push(chunk);
        }
      })
      .on("end", () => {
        console.log("CSV file is successfully processed!");
        resolve(csvData);
      })
      .on("error", (err) => {
        console.log("Fail to procede");
        reject(err);
      });
  });
};
