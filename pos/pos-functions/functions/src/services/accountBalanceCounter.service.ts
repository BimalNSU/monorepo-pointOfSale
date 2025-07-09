import {
  AccountBalance,
  AccountTypeHead,
  ChartOfAccountId,
  NatureType,
  TransactionHead,
  WithId,
} from "@pos/shared-models";

export class AccountBalanceCounter {
  balanceMap: Record<ChartOfAccountId, number>;
  constructor(balance?: WithId<AccountBalance>) {
    this.balanceMap = (balance?.accounts ?? []).reduce(
      (pre, curr) => ({ ...pre, [curr.id]: curr.amount }),
      {}
    );
  }
  add(tHead: TransactionHead, head: AccountTypeHead) {
    let amount = 0;
    if ([AccountTypeHead.ASSET, AccountTypeHead.EXPENSE].includes(head)) {
      amount = tHead.nature === NatureType.debit ? tHead.amount : -tHead.amount;
    } else {
      amount =
        tHead.nature === NatureType.credit ? tHead.amount : -tHead.amount;
    }
    this.balanceMap[tHead.coaId] = (this.balanceMap[tHead.coaId] ?? 0) + amount;
  }
  get() {
    return {
      accounts: Object.entries(this.balanceMap).map(([coaId, amount]) => ({
        id: coaId,
        amount,
      })),
    };
  }
}
