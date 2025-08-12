import { BaseModel, CategoryId } from "./common.model";

export interface ProductImageType {
  path: string; //auto generate
  filename: string;
  isPrimary: boolean; //default false
  order: number;
  // altText: "Back view of premium cotton t-shirt";
  metadata: {
    size: number; //225891
    width: number; //1200
    height: number; //1600
    contentType: "image/jpeg";
    createdAt: Date;
  };
}
export interface Product extends BaseModel {
  name: string;
  description: string | null;
  qty: number;
  salesRate: number;
  purchaseRate: number | null;

  //new fields
  // brand: string | null;
  // categoryId: CategoryId | null;
  // attributes: {
  //   color?: string;
  //   size?: string;
  //   weight?: number;
  //   dimensions?: string;
  //   // product-specific attributes
  // };
  // pricing: {
  //   basePrice: number;
  //   salePrice?: number;
  //   currency: "BDT";
  //   priceHistory: Array<{
  //     price: number;
  //     date: Date;
  //     type: "regular" | "sale" | "clearance";
  //   }>; // Last 5-10 entries
  // };
  media: {
    images: ProductImageType[] | null;
    videos?: string[];
  };
  // ratings: {
  //   average: number; // 1-5
  //   count: number;
  // };
  // shipping: {
  //   weight: number;
  //   dimensions: string;
  //   isFreeShipping: boolean;
  //   fulfillmentType: "warehouse" | "dropship" | "store_pickup";
  // };
  // status: "active" | "inactive" | "discontinued";
  // tags: string[] | null;
}
