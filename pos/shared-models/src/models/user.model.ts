import {
  MaritalStatus,
  Gender,
  BloodGroup,
  Religion,
  BaseModel,
} from "./common.model";

/**
 * *@enum {1: "admin", 2: "manager", 3: "salesman"}
 **/
export type UserRole = 1 | 2 | 3;
/**
 * *@enum {1: "active", 2: "inactive", 3: "revoked"}
 **/
export type RoleStatus = 1 | 2 | 3;

export interface User extends BaseModel {
  firstName: string;
  lastName: string | null;
  email: string | null;
  mobile: string;
  password: string;
  DOB: Date | null;
  gender: Gender | null;
  bloodGroup: BloodGroup | null;
  maritalStatus: MaritalStatus | null;
  religion: Religion | null;
  role: UserRole;
  status: RoleStatus;
  profileImage: string | null; //format: profile/{userId}/{fileNumber}.{extension}
}
