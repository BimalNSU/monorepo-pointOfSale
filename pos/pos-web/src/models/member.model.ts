import {
  Address,
  UserId,
  MaritalStatus,
  UserFiles,
  Gender,
  BloodGroup,
  Religion,
} from "./common.model";
export type Designation =
  | "manager"
  | "md"
  | "ceo"
  | "salesman"
  | "accountant"
  | "computerOperator"
  | "none";
export type Relation =
  | "father"
  | "mother"
  | "brother"
  | "sister"
  | "husband"
  | "wife"
  | "daughter"
  | "son"
  | "grandFather"
  | "grandMother"
  | "other"
  | "none";
export type MemberRole = Relation | Designation;
export interface Member {
  firstName: string;
  lastName: string | null;
  email: string | null;
  mobile: string | null;
  DOB: Date;
  gender: Gender;
  bloodGroup: BloodGroup | null;
  religion: Religion | null;
  maritalStatus: MaritalStatus | null;

  birthCertificate: string | null;
  nid: string | null; //TODO: for now, default is null
  passportNo: string | null;
  bin_vat: string | null;
  drivingLicense: string | null;
  tin: string | null;
  address: Address | null;
  emergencyMobile: string | null;
  emergencyEmail: string | null;
  files: UserFiles;
  //   isEmailVerified: boolean;
  //   isMobileVerified: boolean;
  profileImage: string | null;

  createdAt: Date;
  createdBy: UserId;
  updatedAt: Date;
  updatedBy: UserId;
  isDeleted: boolean;
  deletedBy: UserId | null;
  deletedAt: Date | null;
}
