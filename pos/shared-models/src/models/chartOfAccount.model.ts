import { AccountTypeId, BaseModel } from "./common.model";

export interface ChartOfAccount extends BaseModel {
  name: string;
  accountTypeId: AccountTypeId;
  accountTypeName: string;
  accountTypeHead: number; // 1....5
}
