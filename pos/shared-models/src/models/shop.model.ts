import { BaseModel, UserId } from "./common.model";
import { ShopRole } from "./user.model";

export interface Shop extends BaseModel {
  name: string;
  address: string | null;
  code: string; // will be use in transaction ID, invoiceID etc.
  employees: Record<UserId, ShopRole> | null;
}
