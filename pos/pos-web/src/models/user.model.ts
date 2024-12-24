import {
  PropertyId,
  TenantAgreementId,
  Address,
  UserId,
  UnitId,
  ParkingId,
  ShopId,
  MaritalStatus,
  UserFiles,
  Gender,
  BloodGroup,
  Religion,
} from "./common.model";

export type RegularUserRole = "tenant" | "manager" | "owner";
export type RoleStatus = "inactivated" | "activated" | "revoked";

export interface User {
  firstName: string;
  lastName: string | null;
  email: string | null;
  mobile: string;
  password: string | null;
  DOB: Date;
  gender: Gender | null;
  bloodGroup: BloodGroup | null;
  maritalStatus: MaritalStatus | null;
  religion: Religion | null;
  occupation: string | null;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isRegistrationCompleted: boolean;
  isRegistrationFinalized: boolean;
  isUserActive: boolean;
  role: RegularUserRole | null;
  allowedRoles: Record<RegularUserRole, { status: RoleStatus }>;
  profileImage: string | null; //format: profile/{userId}/{fileNumber}.{extension}

  address: Address | null;
  birthCertificate: string | null;
  nid: string | null;
  passportNo: string | null;
  bin_vat: string | null;
  drivingLicense: string | null;
  residentsNo: string | null;
  emergencyMobile: string | null;
  emergencyEmail: string | null;
  files: UserFiles;

  tenantAssignmentList: Record<PropertyId, { agreementIds: TenantAgreementId[] }>;

  //for owner
  assignmentList: Record<
    PropertyId,
    { unitIds: UnitId[]; parkingIds: ParkingId[]; shopIds: ShopId[] }
  >;
  ownedPropertyIds: PropertyId[];
  assignedPropertyIds: PropertyId[]; //for manager

  createdAt: Date;
  createdBy: UserId;
  updatedAt: Date;
  updatedBy: UserId;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: UserId | null;
}
