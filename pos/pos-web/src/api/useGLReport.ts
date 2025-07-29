import {
  ChartOfAccountId,
  COLLECTIONS,
  FetchStatus,
  Transaction,
  WithId,
  ChartOfAccount as ChartOfAccountModel,
  VoucherType,
  NatureType,
  BasisType,
} from "@pos/shared-models";
import { AccountBalance } from "@pos/shared-models";
import { firestoreConverter } from "@/utils/converter";
import { collection, doc, documentId, orderBy, query, Timestamp, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData } from "reactfire";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { DATE_FORMAT } from "@/constants/dateFormat";
import ChartOfAccountService from "@/service/chartOfAccount.service";
const balanceFirestoreConverter = firestoreConverter<WithId<AccountBalance>>();
const transactionFirestoreConverter = firestoreConverter<WithId<Transaction>>();

interface AccountTransactions
  extends Pick<Transaction, "basisType" | "type" | "referenceNo" | "remark"> {
  createdAt: string;
  sourceVoucher: { id: string; type: VoucherType };
  forVoucher: { id: string; type: VoucherType };
  nature: NatureType;
  amount: number;
  balance: number;
}
interface AccountTree extends Pick<ChartOfAccountModel, "name" | "parentId" | "normalBalance"> {
  path: string | null;
}

export const useGLReport = (queries: { start: Dayjs; end: Dayjs }) => {
  const db = useFirestore();
  const accountService = new ChartOfAccountService(db);
  const [statusChartOfAccount, setStatusChartOfAccount] = useState<FetchStatus>();
  const [chartOfAccountsMap, setChartOfAccountsMap] = useState<
    Record<ChartOfAccountId, AccountTree>
  >({});
  const currentBalanceId = queries.start.format("YYYY-MM-DD");
  const balanceDocRef = doc(db, COLLECTIONS.accountBalances, currentBalanceId).withConverter(
    balanceFirestoreConverter,
  );
  const { status: statusBalance, data: accountBalance } = useFirestoreDocData(balanceDocRef, {
    idField: "id",
  });
  const queryIntransactions = query(
    collection(db, COLLECTIONS.transactions),
    where("createdAt", ">=", queries.start.startOf("day").toDate()),
    where("createdAt", "<=", queries.end.endOf("day").toDate()),
    orderBy("createdAt", "desc"),
    orderBy(documentId(), "desc"),
  ).withConverter(transactionFirestoreConverter);
  const { status: transactionStatus, data: transactions } = useFirestoreCollectionData(
    queryIntransactions,
    { idField: "id" },
  );
  const groupByTransactions = (
    data: WithId<Transaction>[],
    accountBalance: WithId<AccountBalance>,
  ): Array<
    Pick<ChartOfAccountModel, "name" | "normalBalance"> & {
      id: ChartOfAccountId;
      path: string;
      balance: { opening: number; closing: number };
      transactions: WithId<AccountTransactions>[];
    }
  > => {
    const coaIdsMap: Record<
      ChartOfAccountId,
      Pick<ChartOfAccountModel, "name" | "normalBalance"> & {
        path: string;
        balance: { opening: number; closing: number };
        transactions: WithId<AccountTransactions>[];
      }
    > = {};
    data.forEach((t) =>
      t.heads.forEach((h) => {
        const coa = chartOfAccountsMap[h.coaId];
        const coaTransactions = coaIdsMap[h.coaId] ?? {
          normalBalance: coa.normalBalance,
          name: coa.name,
          path: coa.path,
          balance: {
            opening: accountBalance?.accounts.find((a) => a.id === h.coaId)?.amount ?? 0,
            closing: 0,
          },
          transactions: new Array<WithId<AccountTransactions>>(),
        };
        //cumulating all transaction's amount for closing_balance of each chartOfAccount
        coaTransactions.balance.closing +=
          coa.normalBalance === NatureType.debit
            ? h.nature === NatureType.debit
              ? h.amount
              : -h.amount
            : h.nature === NatureType.credit
            ? h.amount
            : -h.amount;

        coaTransactions.transactions.push({
          id: t.id,
          basisType: t.basisType,
          type: t.type,
          createdAt: dayjs(t.createdAt).format(DATE_FORMAT),
          sourceVoucher: { id: t.sourceVoucherId, type: t.sourceVoucherType },
          forVoucher: { id: t.forVoucherId, type: t.forVoucherType },
          referenceNo: t.referenceNo,
          remark: t.remark,
          nature: h.nature,
          amount: h.amount,
          balance: coaTransactions.balance.closing,
        });

        coaIdsMap[h.coaId] = coaTransactions;
      }),
    );
    if (Object.keys(coaIdsMap).length) {
      return Object.entries(coaIdsMap).map(([coaId, value]) => ({ ...value, id: coaId }));
    } else {
      return (
        accountBalance?.accounts.map((act) => {
          const coa = chartOfAccountsMap[act.id];
          return {
            id: act.id,
            normalBalance: coa.normalBalance,
            name: coa.name,
            path: coa.path || "",
            balance: {
              opening: act.amount,
              closing: 0,
            },
            transactions: new Array<WithId<AccountTransactions>>(),
          };
        }) ?? []
      );
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    if (statusBalance === "success" && transactionStatus === "success") {
      const coaIdsSet = new Set<ChartOfAccountId>();
      accountBalance?.accounts.forEach((a) => {
        coaIdsSet.add(a.id);
      });
      transactions.forEach((t) => t.heads.forEach((h) => coaIdsSet.add(h.coaId)));
      const coaIds = [...coaIdsSet];

      (async (ids: ChartOfAccountId[]) => {
        try {
          setStatusChartOfAccount("loading");
          const fetchedData = ids.length ? await accountService.getByIdsWithPaths(ids) : {};
          if (!abortController.signal.aborted) {
            setChartOfAccountsMap(fetchedData);
            setStatusChartOfAccount("success");
          }
        } catch (e) {
          if (!abortController.signal.aborted) {
            setStatusChartOfAccount("error");
            console.error("Failed to fetch shops:", e);
          }
        }
      })(coaIds);
    }
    return () => {
      abortController.abort();
    };
  }, [accountBalance, transactions]);

  const data = useMemo(
    () =>
      statusBalance === "success" &&
      transactionStatus === "success" &&
      Object.keys(chartOfAccountsMap).length
        ? groupByTransactions(transactions, accountBalance)
        : [],
    [accountBalance, transactions, chartOfAccountsMap],
  );
  const status = useMemo<FetchStatus>(() => {
    if (
      statusBalance === "success" &&
      transactionStatus === "success" &&
      statusChartOfAccount === "success"
    ) {
      return "success";
    } else if (
      statusBalance === "error" ||
      transactionStatus === "error" ||
      statusChartOfAccount === "error"
    ) {
      return "error";
    } else {
      return "loading";
    }
  }, [statusBalance, transactionStatus, statusChartOfAccount]);
  return { status, data };
};
