import { DocumentReference } from "firebase-admin/firestore";

export type UserId = string;
export type MemberId = string;
export type MemberAssignmentId = string;
export type RefId = string;
export type PropertyId = string;
export type UnitId = string;
export type ParkingId = string;
export type ShopId = string;
export type TenantAgreementId = string;
export type BillUserType = "admin" | "manager";
export type InvoiceId = string;
export type PbillNameId = string;
export type PbillConfigId = string;
export type PropertyBillId = string;
export type CommonBillId = string;
export type InvoicePaymentId = string;
export type CommunicationId = string;

export type PointTransactionId = string;
export type PointUsageId = string;
export type PropertyPointId = string;
export type NidRecordId = string;
export type NidCreditUsageId = string;

export type WithRef<T> = T & { ref: DocumentReference<T> };
export type WithId<T> = T & { id: string };

export type ProductId = number;
export type CategoryId = number;

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
  thana: string | null; // temporarily used "null"
  postOffice: number | null; // temporarily used "null"
  ward: number | null; // temporarily used "null"
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
export interface BaseModel {
  createdAt: Date;
  createdBy: UserId;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: UserId | null;
  updatedAt: Date;
  updatedBy: UserId;
}
