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
  async remove(id: ShopId, authUserId: UserId) {
    const shopObj = new Shop();
    const shop = await shopObj.get(id);
    if (!shop) {
      throw new AppError("Invalid shop ID", 400);
    }
    const batch = db.batch();
    const now = FieldValue.serverTimestamp();

    //soft delete shop document with removing employees references
    shopObj.update(
      id,
      {
        employees: null,
        updatedBy: authUserId,
        isDeleted: true,
        deletedAt: now,
        deletedBy: authUserId,
      },
      batch,
    );

    const accessedUserIds = Object.keys(shop.employees ?? {});
    if (accessedUserIds.length) {
      const userObj = new User();
      const accessedUsers = await userObj.getByIds(accessedUserIds);
      accessedUsers.forEach((u) =>
        userObj.update(
          u.id,
          {
            shopIds:
              (u.shopIds ?? []).length > 1
                ? FieldValue.arrayRemove(id)
                : FieldValue.delete(),
            ...(Object.keys(u.shopRoles ?? {}).length > 1
              ? { [`shopRoles.${id}`]: FieldValue.delete() }
              : { shopRoles: FieldValue.delete() }),
            updatedAt: now,
            updatedBy: authUserId,
          },
          batch,
        ),
      );

      //remove shopId from all users' session
      const sessionObj = new Session();
      const targetSessions = await sessionObj.findBy({ shopId: id });
      targetSessions.forEach((s) =>
        sessionObj.update(
          s.id,
          {
            shopId: FieldValue.delete(),
            shopRole: FieldValue.delete(),
          },
          batch,
        ),
      );
    }
    return await batch.commit();
  }
  async assignRole(
    shopId: ShopId,
    employeeId: UserId,
    shopRole: ShopRole,
    updatedBy: UserId,
  ) {
    try {
      const userObj = new User();
      const user = await userObj.get(employeeId);
      if (!user) {
        throw new AppError("Invalid user ID", 400);
      }
      const shopObj = new Shop();
      const shop = await shopObj.get(shopId);
      if (!shop) {
        throw new AppError("Invalid shop ID", 400);
      }
      const batch = db.batch();
      shopObj.update(
        shopId,
        { employees: { [employeeId]: shopRole }, updatedBy },
        batch,
      );

      //#region: update in user's document
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
      const now = FieldValue.serverTimestamp();
      userObj.update(
        employeeId,
        { shopIds, shopRoles, updatedAt: now, updatedBy },
        batch,
      );
      //#endregion

      //update sessions
      const sessionObj = new Session();
      const sessions = await sessionObj.findBy({ userId: employeeId, shopId });
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
  async revokeShopRole(shopId: ShopId, userId: UserId, authUserId: UserId) {
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

      const batch = db.batch();
      shopObj.update(
        shopId,
        {
          ...(Object.keys(shop.employees ?? {}).length > 1
            ? { [`employees.${userId}`]: FieldValue.delete() }
            : { employees: null }),
          updatedBy: authUserId,
        },
        batch,
      );

      //#region: remove shop access ref from user's document
      if (!user.shopIds || !user.shopIds.includes(shopId)) {
        throw new AppError("Invalid request", 400);
      }
      const now = FieldValue.serverTimestamp();
      userObj.update(
        userId,
        {
          ...(Object.keys(user.shopIds ?? []).length > 1
            ? { shopIds: FieldValue.arrayRemove(shopId) }
            : { shopIds: FieldValue.delete() }),
          ...(Object.keys(user.shopRoles ?? {}).length > 1
            ? { [`shopRoles.${shopId}`]: FieldValue.delete() }
            : { shopRoles: FieldValue.delete() }),
          updatedBy: authUserId,
          updatedAt: now,
        },
        batch,
      );
      //#endregion

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
