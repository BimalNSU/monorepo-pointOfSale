import { BaseModel, ShopId, UserId } from "./common.model";

export interface EmployeeAssignments extends BaseModel {
  shopId: ShopId;
  userId: UserId;
}
