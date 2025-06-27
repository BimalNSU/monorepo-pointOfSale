import { NextFunction, Request, Response } from "express";
import {
  ActiveSession,
  ShopId,
  ShopRole,
  UserRole as UserRoleType,
  WithId,
} from "@pos/shared-models";
import { USER_ROLE } from "../constants/common";

export class RoleMiddleware {
  static isAdmin(req: Request, res: Response, next: NextFunction) {
    const { session } = res.locals as {
      authUserId: string;
      session: WithId<Pick<ActiveSession, "role" | "shopId" | "shopRole">>;
    };
    if (session.role !== USER_ROLE.VALUES.Admin) {
      return res.status(403).json({ message: "Access denied" });
    }
    return next();
  }
  static shopAccessAuthorize(req: Request, res: Response, next: NextFunction) {
    const { shopId, shopRole } = res.locals as {
      authUserId: string;
      role: UserRoleType;
      shopId: ShopId;
      shopRole: ShopRole;
    };
    if (!shopId || !shopRole) {
      return res.status(403).json({ message: "Access denied" });
    }
    return next();
  }
}
