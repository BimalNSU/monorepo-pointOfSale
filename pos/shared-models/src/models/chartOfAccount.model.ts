import { BaseModel } from "./common.model";
import { NatureType } from "./transaction.model";

export interface ChartOfAccount extends BaseModel {
  name: string;
  parentId: string | null;
  // type: string;
  // subtype: string | null;
  normalBalance: NatureType | null;
  isPostable: boolean;
}
