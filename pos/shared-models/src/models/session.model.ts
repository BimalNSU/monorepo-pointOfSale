import { UserId } from "./common.model";
import { ShopRole, UserRole } from "./user.model";

export interface Session {
  userId: UserId;
  role: UserRole;
  shopId?: string;
  shopRole?: ShopRole;
  lastLogin: Date;
  ip: string | null;
  device: string | null;
  createdAt: Date;
  updatedAt: Date;
}
