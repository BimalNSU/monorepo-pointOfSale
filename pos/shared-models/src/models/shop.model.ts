import { BaseModel, UserId } from "./common.model";
import { ShopRole } from "./user.model";

export interface Shop extends BaseModel {
  name: string;
  address: string | null;
  officials: Record<UserId, ShopRole>;
}
