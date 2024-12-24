import { BaseModel } from "./common.model";

export interface Category extends BaseModel {
  name: string;
  imageUrl: string | null;
}
