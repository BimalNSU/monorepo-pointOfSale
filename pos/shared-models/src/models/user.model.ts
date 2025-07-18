import {
  MaritalStatus,
  Gender,
  BloodGroup,
  Religion,
  BaseModel,
  ShopId,
} from "./common.model";

/**
 * *@enum {1: "admin", 2: "employee", 3: "vendor"}
 **/
export type UserRole = 1 | 2 | 3;
/**
 * *@enum {1: "Manager", 2: "Cashier", 3: "Salesman"}
 **/
export type ShopRole = 1 | 2 | 3;
export interface User extends BaseModel {
  firstName: string;
  lastName: string | null;
  email: string | null;
  mobile: string;
  password: string | null; //null if user is vendor
  DOB: Date | null;
  gender: Gender | null;
  bloodGroup: BloodGroup | null;
  maritalStatus: MaritalStatus | null;
  religion: Religion | null;
  role: UserRole;
  isActive: boolean; //default true
  profileImage: string | null; //format: profile/{userId}/{fileNumber}.{extension}

  //Only for employee
  shopIds?: ShopId[] | null; //To get selected shop's employees
  shopRoles?: Record<ShopId, ShopRole> | null;
}
