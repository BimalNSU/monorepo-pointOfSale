// import { Timestamp } from "firebase-admin/firestore";
import { BaseModel, CategoryId } from "./common.model";

export interface Product extends BaseModel {
  name: string;
  description: string | null;
  qty: number;
  salesRate: number;
  purchaseRate: number | null;
  imagesFiles: string[] | null;
  category: { id: CategoryId; name: string };
}
