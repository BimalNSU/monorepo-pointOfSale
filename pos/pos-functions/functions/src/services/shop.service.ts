import {
  User as UserModel,
  UserId,
  ShopId,
  ShopRole,
} from "@pos/shared-models";
import { AppError } from "../utils/AppError";
import { db, FieldValue } from "../firebase";
import { User } from "../db-collections/user.collection";
import { Shop } from "../db-collections/shop.collection";
import { Session } from "src/db-collections/session.collection";
type omitType = "createdBy" | "updatedBy" | "deletedAt" | "deletedBy";
export type EditData = Omit<UserModel, omitType | "createdBy" | "createdAt">;

export class ShopService {
  async assignRole(shopId: ShopId, userId: UserId, shopRole: ShopRole) {
    try {
      const userObj = new User();
      const user = await userObj.get(userId);
      if (!user) {
        throw new AppError("Invalid user ID", 400);
      }
      const shopObj = new Shop();
      const shop = await shopObj.get(shopId);
      if (!shop) {
        throw new AppError("Invalid shop ID", 400);
      }
      if (user.shopRoles && user.shopRoles[shopId] === shopRole) {
        throw new AppError("Same role request", 400);
      }
      const shopIds = user.shopIds || [];
      const shopRoles = user.shopRoles || Object();
      if (!shopIds.includes(shopId)) {
        shopIds.push(shopId);
      }
      if (!shopRoles[shopId] || shopRoles[shopId] !== shopRole) {
        shopRoles[shopId] = shopRole;
      }
      const batch = db.batch();
      userObj.update(userId, { shopIds, shopRoles }, batch);

      //update sessions
      const sessionObj = new Session();
      const sessions = await sessionObj.findBy({ userId, shopId });
      sessions.forEach((s) => {
        sessionObj.update(
          s.id,
          { ...(s.shopId && { shopId }), shopRole },
          batch,
        );
      });
      return await batch.commit();
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        console.error("Unexpected error in assign role:", err);
        throw new AppError(err.message || "Internal Server Error", 500);
      } else {
        throw new AppError("Unknown error occurred", 500);
      }
    }
  }
  async revokeShopRole(shopId: ShopId, userId: UserId) {
    try {
      const userObj = new User();
      const user = await userObj.get(userId);
      if (!user) {
        throw new AppError("Invalid user ID", 400);
      }
      const shopObj = new Shop();
      const shop = await shopObj.get(shopId);
      if (!shop) {
        throw new AppError("Invalid shop ID", 400);
      }
      if (!user.shopIds || !user.shopIds.includes(shopId)) {
        throw new AppError("Invalid request", 400);
      }
      const shopIds = user.shopIds.filter((sId) => sId !== shopId);
      const shopRoles = Object.entries(user.shopRoles || {}).reduce<
        Record<ShopId, ShopRole>
      >((pre, [sId, sRole]) => {
        if (sId !== shopId) {
          pre[sId] = sRole;
        }
        return pre;
      }, {});

      const batch = db.batch();
      userObj.update(
        userId,
        {
          ...(!shopIds.length && { shopIds: FieldValue.delete() }),
          ...(!Object.keys(shopRoles).length && {
            shopRoles: FieldValue.delete(),
          }),
        },
        batch,
      );

      //update sessions
      const sessionObj = new Session();
      const sessions = await sessionObj.findBy({ userId, shopId });
      sessions.forEach((s) => {
        sessionObj.update(
          s.id,
          { shopId: FieldValue.delete(), shopRole: FieldValue.delete() },
          batch,
        );
      });
      return await batch.commit();
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        console.error("Unexpected error in assign role:", err);
        throw new AppError(err.message || "Internal Server Error", 500);
      } else {
        throw new AppError("Unknown error occurred", 500);
      }
    }
  }
}
