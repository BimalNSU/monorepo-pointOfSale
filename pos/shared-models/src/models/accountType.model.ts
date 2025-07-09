export enum AccountTypeHead {
  ASSET = 1,
  EQUITY = 2,
  LIABILITY = 3,
  INCOME = 4,
  EXPENSE = 5,
}
export interface AccountType {
  name: string;
  head: AccountTypeHead;
}
