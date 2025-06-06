import { BaseModel, ProductId, UserId } from "./common.model";

/**
 * *@enum {1: "pending", 2: "receive", 3: "cancel"}
 **/
export type PurchaseStatus = 1 | 2 | 3;
export interface PurchaseOrderItem {
  name: string; //product name
  qty: number;
  rate: number;
}
export interface PurchaseOrder extends BaseModel {
  status: PurchaseStatus; //default 'pending'
  totalAmount: number;
  due: number;
  note: string | null;
  itemIds: ProductId[];
  items: Record<ProductId, PurchaseOrderItem>;
  vendorId: UserId | null; //i.e. supplier ID
  storeId: string;
}
