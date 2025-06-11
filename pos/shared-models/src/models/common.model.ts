import { DocumentReference } from "firebase/firestore";

export type UserId = string;
export type MemberId = string;
export type InvoiceId = string;
export type InvoicePaymentId = string;
export type MessageId = string; // will be deprecated
export type CommunicationId = string;
export type FetchStatus = "loading" | "success" | "error";

export type WithRef<T> = T & { ref: DocumentReference<T> };
export type WithId<T> = T & { id: string };

export type CustomerPaymentId = string;
export type SalesReceiptId = string;
export type VendorId = number;
export type VendorBillId = string;
export type VendorBillItemId = string;

export type Address = {
  house: string;
  village_road: string;
  block_sector_area: string | null;
  avenue: string | null;
  // country: string;
  division_state: string;
  district: string;
  cc_m_c: { type: string; value: string } | null;
  upazila: string | null;
  union: string | null;
  thana: string | null; //temporarily used "null"
  postOffice: number | null; //temporarily used "null"
  ward: number | null; //temporarily used "null"
};
export type UserFiles = {
  birthCertificate: string | null;
  passport: string | null;
  nid: string | null;
  tin: string | null;
  tradeLicense: string | null;
  bin_vat: string | null;
  others: string | null;
};
export type MaritalStatus = "unmarried" | "married" | "devorced" | "others";
/**
 * *@enum {1: "male", 2: "female", 3: "other"}
 **/
export type Gender = 1 | 2 | 3;
export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "O+"
  | "O-"
  | "AB+"
  | "AB-";
export type Religion =
  | "islam"
  | "hindu"
  | "buddhism"
  | "christianity"
  | "others";

export type ProductId = string;
export type CategoryId = number;
export type DocumentCounterId = string;
export type ShopId = string;
export type ActiveSessionId = string;
export interface BaseModel {
  createdAt: Date;
  createdBy: UserId;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: UserId | null;
  updatedAt: Date;
  updatedBy: UserId;
}
