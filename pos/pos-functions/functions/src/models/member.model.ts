import {
  PropertyId,
  Address,
  UserId,
  ShopId,
  UnitId,
  MemberAssignmentId,
  UserFiles,
  MaritalStatus,
  NidRecordId,
} from "./common.model";

type Gender = 1 | 2 | 3; // 1: "male", 2: "female", 3: "other"
type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
type Religion = "islam" | "hindu" | "buddhism" | "christianity" | "others";
export type Designation =
  | "manager"
  | "md"
  | "ceo"
  | "salesman"
  | "accountant"
  | "computerOperator";
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
  | "other";
export type MemberRole = Relation | Designation;
export type MemberAssign = {
  unitId: UnitId | null;
  shopId: ShopId | null;
  role: MemberRole;
};

export type ShopMemberAssignment = {
  shopIds: ShopId[];
  roleShops: Record<
    ShopId,
    { role: Designation; memberAssignmentId: MemberAssignmentId }
  >;
};

export type ResidentialMemberAssignment = {
  unitIds: UnitId[];
  roleUnits: Record<
    UnitId,
    { role: Relation; memberAssignmentId: MemberAssignmentId }
  >;
};
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
  nid: string | null; // TODO: for now, default is null
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

  memberAssignmentList: Record<
    PropertyId,
    ShopMemberAssignment | ResidentialMemberAssignment
  > | null;
  nidVerificationInfo: { nidRecordId: NidRecordId | null; attempts: number }; // nidRecordId null if member id isn't verified to nid server yet

  createdAt: Date;
  createdBy: UserId;
  updatedAt: Date;
  updatedBy: UserId;
  isDeleted: boolean;
  deletedBy: UserId | null;
  deletedAt: Date | null;
}
