import { ShopRole, UserRole } from "./user.model";

export interface ActiveSession {
  role: UserRole;
  shopId?: string;
  shopRole?: ShopRole;
  lastLogin: Date;
  ip: string | null;
  device: string | null;
  createdAt: Date;
  updatedAt: Date;
}
