import { MaritalStatus, BaseModel } from "./common.model";
export type RegularUserRole = "tenant" | "manager" | "owner";

/**
 * *@enum {1: "admin", 2: "manager", 3: "salesman"}
 **/
type Role = 1 | 2 | 3;

/**
 * *@enum {1: "male", 2: "female", 3: "other"}
 **/
type Gender = 1 | 2 | 3;

type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
type Religion = "islam" | "hindu" | "buddhism" | "christianity" | "others";

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
  occupation: string | null;

  isActive: boolean;
  role: Role | null;
  profileImage: string | null;
}
