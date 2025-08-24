import {
  ChartOfAccountId,
  ChartOfAccount as ChartOfAccountModel,
  COLLECTIONS,
  FetchStatus,
  Invoice,
  InvoiceId,
  WithId,
} from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { ChartOfAccount } from "@/db-collections/chartOfAccount.collection";
import { useEffect, useMemo, useState } from "react";
const invoiceFirestoreConverter = firestoreConverter<WithId<Invoice>>();

export const useInvoice = (id: InvoiceId) => {
  const db = useFirestore();
  const charOfAccount = new ChartOfAccount(db);
  const [paymentAccounts, setPaymentAccounts] = useState<WithId<ChartOfAccountModel>[]>();
  const [accountStatus, setAccountStatus] = useState<FetchStatus>("loading");
  const docRef = doc(db, COLLECTIONS.invoices, id).withConverter(invoiceFirestoreConverter);
  const { status: invoiceStatus, data: invoice } = useFirestoreDocData(docRef, {
    idField: "id",
  });

  useEffect(() => {
    const abortController = new AbortController();
    if (invoice) {
      (async (paymentAccountIds: ChartOfAccountId[]) => {
        setAccountStatus("loading");
        try {
          const accounts = await charOfAccount.getByIds(paymentAccountIds);
          if (!abortController.signal.aborted) {
            setAccountStatus("success");
            setPaymentAccounts(accounts);
          }
        } catch (err) {
          if (!abortController.signal.aborted) {
            setAccountStatus("error");
            setPaymentAccounts([]);
          }
        }
      })(invoice.paymentAccountIds);
    }
    return () => {
      abortController.abort();
    };
  }, [invoice]);
  const status = useMemo(() => {
    if (invoiceStatus === "success" && accountStatus === "success") {
      return "success";
    } else if (invoiceStatus === "error" || accountStatus === "error") {
      return "error";
    } else {
      return "loading";
    }
  }, [accountStatus, invoiceStatus]);
  const data = useMemo(() => {
    if (invoice && paymentAccounts?.length) {
      const { payments, ...rest } = invoice;
      return {
        ...rest,
        payments: Object.entries(payments).map(([accountId, amount]) => {
          const matchedAccount = paymentAccounts.find((pAcc) => pAcc.id === accountId);
          return { accountId, amount, name: matchedAccount?.name || "" };
        }),
      };
    } else {
      return null;
    }
  }, [invoice, paymentAccounts]);
  return { status, data };
};
