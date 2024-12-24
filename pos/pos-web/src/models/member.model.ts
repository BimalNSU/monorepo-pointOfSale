import {
  PropertyId,
  Address,
  UserId,
  ShopId,
  UnitId,
  MemberAssignmentId,
  MaritalStatus,
  UserFiles,
  NidRecordId,
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
export type MemberAssign = { unitId: UnitId | null; shopId: ShopId | null; role: MemberRole };

export type ShopMemberAssignment = {
  shopIds: ShopId[];
  roleShops: Record<ShopId, { role: Designation; memberAssignmentId: MemberAssignmentId }>;
};

export type ResidentialMemberAssignment = {
  unitIds: UnitId[];
  roleUnits: Record<UnitId, { role: Relation; memberAssignmentId: MemberAssignmentId }>;
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

  memberAssignmentList: Record<
    PropertyId,
    ShopMemberAssignment | ResidentialMemberAssignment
  > | null;
  nidVerificationInfo: { nidRecordId: NidRecordId | null; attempts: number };

  createdAt: Date;
  createdBy: UserId;
  updatedAt: Date;
  updatedBy: UserId;
  isDeleted: boolean;
  deletedBy: UserId | null;
  deletedAt: Date | null;
}
