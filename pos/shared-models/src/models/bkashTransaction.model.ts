export type TransactionStatus = string;
export interface BkashTransaction {
  amount: number;
  status: TransactionStatus;
  reference: string | null; //User inputed reference value.
  customerMobile: string;
  completedTime: string;
  createdAt: Date;
}
