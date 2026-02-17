import { BaseModel } from "./common.model";
export type ClothType = "pant" | "shirt" | "polo_shirt";
export type PantFitType = "slim" | "regular" | "bootcut" | "baggy";
export interface Pant {
  fit: PantFitType;
  waist: number;
  side_length: number; //side length
  front_rise: number;
  thigh: number;
  leg_opening: number;
  remark?: string | null;
}
export interface Shirt {
  chest: number;
  long: number;
  remark?: string | null;
}
export interface Polo_shirt {
  chest: number;
  long: number;
  remark?: string | null;
}

export interface Customer extends BaseModel {
  firstName: string;
  lastName: string | null;
  email: string | null;
  mobile: string;
  addedBy: string;
  cloths: { type: ClothType; info: Pant | Shirt | Polo_shirt }[];
}
