import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { InvoiceId, PropertyId, UserId } from "./common.model";

export type PaymentMode = "cash" | "cheque" | "bkash" | "bankTransfer";
export type PaymentStatus = "done" | "pending" | "cancel";
export interface InvoicePayment {
  receiveAmount: number; // receiveAmount = total paid + returnAmount
  returnAmount: number;
  mode: PaymentMode;
  depositTo: string[];
  reference: string | null; // TODO: need to know what is it
  status: PaymentStatus;
  invoiceIds: InvoiceId[];
  invoices: Record<
    InvoiceId,
    {
      createdAt: Date | FieldValue | Timestamp;
      dueDate: Date;
      invoiceTotalAmount: number;
      due: number;
      paid: number;
    }
  >;
  propertyId: PropertyId;
  userId: UserId;
  createdAt: Date;
  createdBy: UserId;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: UserId | null;
  updatedAt: Date;
  updatedBy: UserId;
}
