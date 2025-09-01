import { COLLECTIONS, WithId, ChartOfAccount, RESERVE_ACCOUNT_ID } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import { collection, query, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
const coaFirestoreConverter = firestoreConverter<WithId<ChartOfAccount>>();

export const useDepositAccounts = () => {
  const db = useFirestore();
  const queryInChartOfAccounts = query(
    collection(db, COLLECTIONS.chartOfAccounts),
    where("isDeleted", "==", false),
    where("parentId", "in", [
      RESERVE_ACCOUNT_ID.bank,
      RESERVE_ACCOUNT_ID.MFS,
      RESERVE_ACCOUNT_ID.current_assets,
    ]),
    where("isPostable", "==", true),
  ).withConverter(coaFirestoreConverter);
  const { status, data } = useFirestoreCollectionData(queryInChartOfAccounts, { idField: "id" });

  return { status, data };
};
