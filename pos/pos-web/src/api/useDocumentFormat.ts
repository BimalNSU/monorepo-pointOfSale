import { COLLECTIONS } from "@pos/shared-models";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
import { DocumentCounterId } from "@pos/shared-models/dist/models/common.model";
import { DocumentCounter } from "@pos/shared-models/dist/models/documentCounter.model";
import { firestoreConverter } from "@/utils/converter";
import dayjs from "dayjs";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";
const counterFirestoreConverter = firestoreConverter<DocumentCounter>();
const dateFormat = "YYYYMMDD";
const maxLength = 3;

export const useDocumentFormat = (id: DocumentCounterId) => {
  const db = useFirestore();
  const docRef = doc(db, COLLECTIONS.documentCounters, id).withConverter(counterFirestoreConverter);
  const { status, data: counterData } = useFirestoreDocData(docRef, { idField: "id" });

  const syncDocumentCounter = async (data: DocumentCounter) => {
    await setDoc(docRef, data);
  };
  useEffect(() => {
    if (status !== "success") return;
    if (!counterData) {
      const initialFormat = {
        isIncludeDateStr: false,
        prefix: null,
        count: 0,
        dateStr: null,
        ...(id === DOCUMENT_FORMAT.VALUES.Invoice
          ? {
              isIncludeDateStr: true,
              dateStr: dayjs(new Date()).format("YYYYMMDD"),
            }
          : {}),
      };
      syncDocumentCounter(initialFormat);
    }
    if (counterData?.isIncludeDateStr) {
      const now = dayjs(new Date());
      if (!dayjs(counterData.dateStr, dateFormat).isSame(now, "day")) {
        setDoc(docRef, { dateStr: now.format(dateFormat), count: 0 }, { merge: true });
      }
    }
  }, [counterData]);

  const documentId = useMemo(() => {
    if (!counterData) {
      return null;
    }
    let newDocumentId = "";
    if (counterData.prefix) {
      newDocumentId += counterData.prefix;
    }
    if (counterData.isIncludeDateStr) {
      newDocumentId += counterData.dateStr;
    }
    newDocumentId += (counterData.count + 1).toString().padStart(maxLength, "0"); //add '0' on the left if needed and return 'MAX_SUFFIX_NUMERIC' numeric characters
    return newDocumentId;
  }, [counterData]);

  return { status, documentId };
};
