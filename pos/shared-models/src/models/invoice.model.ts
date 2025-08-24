import { FieldValue } from "firebase/firestore";
import { ChartOfAccountId, ProductId, UserId } from "./common.model";

export enum InvoiceStatus {
  Draft = 0,
  // Unpaid = 1,
  // Partial = 2,
  Paid = 3,
  Returned = 4,
  Cancelled = 5,
}
export interface InvoiceItem {
  productId: ProductId;
  name: string; //product name
  description: string | null;
  qty: number;
  rate: number;
  discount: number | null;
}
export interface ReturnItem {
  productId: ProductId;
  qty: number;
}
export interface Invoice {
  status: InvoiceStatus; //default 'paid'
  totalAmount: number; // amount after discount
  specialDiscount: number | null;
  subject: string | null;
  items: InvoiceItem[];
  returnItems?: ReturnItem[];
  createdAt: Date | FieldValue;
  createdBy: UserId;
  updatedAt: Date | FieldValue;
  updatedBy: UserId;
  isDeleted: boolean; // default: false
  deletedAt: Date | null;
  deletedBy: UserId | null;

  // NEW
  targetUserId: UserId | null;
  paymentAccountIds: ChartOfAccountId[];
  payments: Record<ChartOfAccountId, number>;
}
