import { BaseModel } from "./common.model";

export interface CustomerFeedback extends BaseModel {
  customerName: string;
  mobile: string;

  //rating
  collection: number;
  valueForMoney: number;
  staffService: number;
  storeAmbience: number;

  revisitReason: string;
  improvement: string | null;
}
