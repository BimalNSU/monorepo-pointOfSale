import { FieldValue } from "firebase/firestore";
import { ProductId, UserId } from "./common.model";

export type InvoiceStatus = number;
export interface InvoiceItem {
  productId: ProductId;
  name: string; //product name
  description: string | null;
  qty: number;
  rate: number;
  discount: number | null;
}
export interface Invoice {
  status: InvoiceStatus; //default 'paid'
  totalAmount: number; // amount after discount
  discount: number | null;
  note: string | null;
  items: InvoiceItem[];
  createdAt: Date | FieldValue;
  createdBy: UserId;
  updatedAt: Date | FieldValue;
  updatedBy: UserId;
  isDeleted: boolean; // default: false
  deletedAt: Date | null;
  deletedBy: UserId | null;

  // NEW
  targetUserId: UserId | null;
}
