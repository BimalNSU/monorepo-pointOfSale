import { BaseModel } from "./common.model";
export type ClothType = "pant" | "shirt" | "polo_shirt";
export interface Pant {
  waist: number;
  side_length: number; //side length
  front_rise: number;
  thight: number;
  leg_opening: number;
}
export interface Shirt {
  chest: number;
  long: number;
}
export interface Polo_shirt {
  chest: number;
  long: number;
}

export interface Customer extends BaseModel {
  firstName: string;
  lastName: string | null;
  email: string | null;
  mobile: string;

  cloths: { type: ClothType; info: Pant | Shirt | Polo_shirt }[];
}
