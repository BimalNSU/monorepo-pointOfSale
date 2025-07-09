import { UserId } from "./common.model";
export enum BasisType {
  Accrual = 1,
  Cash = 2,
}
export enum NatureType {
  debit = 0,
  credit = 1,
}
export enum VoucherType {
  Expense = 0,
  Bill = 1,
  VendorPayment = 2,
  Invoice = 3,
  SalesReceipt = 4,
  CustomerPayment = 5,
  Journal = 6,
}
export enum TransactionTypes {
  Expense = 0,
  Bill = 1,
  VendorPayment = 2,
  BillCancel = 3,
  // BillDelete = 4,
  Invoice = 5,
  InvoiceCancel = 6,
  // InvoiceDelete = 7,
  CustomerPayment = 8,
  // SalesReceipt = 9,
  // SalesReceiptCancel = 10,
  // SalesReceiptDelete = 11,
  Income = 12,
  Voucher = 13,
}
export interface TransactionHead {
  coaId: string;
  name: string;
  nature: number; //0:debit ; 1: credit
  amount: number;
}
export interface Transaction {
  basisType: number; //0 means accrual, 1 means cash
  type: number;

  forVoucherType: VoucherType;
  forVoucherId: string; //e.g. all types' of vouchers

  sourceVoucherType: VoucherType;
  //This ID refers to the original voucher that generated the transaction
  sourceVoucherId: string; //e.g. invoiceId, billId,customerPaymentId, billId, expense

  remark: string | null;
  referenceNo: string | null;

  headCoaIds: string[]; //only for query from chart of account; e.g. GL, Balance sheet etc.
  heads: Array<TransactionHead>;
  createdAt: Date;
  createdBy: UserId;
}
