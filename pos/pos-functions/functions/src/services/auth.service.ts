import {
  ActiveSession as ActiveSessionModel,
  ActiveSessionId,
  UserId,
} from "@pos/shared-models";
import { AppError } from "../AppError";
import { auth, db } from "../firebase";
import { UserService } from "./user.service";
import { ActiveSession } from "../db-collections/session.collection";

export class AuthService {
  static async authorization(authorization: string) {
    try {
      const pattern = new RegExp(`(^${"Bearer "})`, "gi");
      const idToken = authorization.replace(pattern, "");
      const decodedToken = await auth.verifyIdToken(idToken);
      if (!decodedToken.uid) {
        throw new AppError(
          401,
          "Unauthorized",
          "Id token isn't matched. Error raises from AuthService.authorization service layer"
        );
      }
      return decodedToken;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        // throw new Error(`err: ${err.message}`);
        throw err; // TODO: convert to AppError with 500 error code
      } else {
        throw new Error(err as string);
      }
    }
  }
  static async getSession(userId: UserId, sessionId: ActiveSessionId) {
    return await new ActiveSession(userId).get(sessionId);
  }
  static async updateSession(
    sessionId: ActiveSessionId,
    sessionData: Pick<ActiveSessionModel, "role" | "shopId" | "shopRole">,
    authUserId: UserId
  ) {
    try {
      const userService = new UserService();
      const user = await userService.findOne(authUserId);
      if (
        sessionData.shopId &&
        sessionData.shopRole &&
        (user.shopRoles ?? {})[sessionData.shopId] !== sessionData.shopRole
      ) {
        throw new AppError(401, "Unauthorized role switching");
      }
      const batch = db.batch();
      new ActiveSession(authUserId).update(sessionId, sessionData, batch);
      return await batch.commit();
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        // throw new Error(`err: ${err.message}`);
        throw err; // TODO: convert to AppError with 500 error code
      } else {
        throw new Error(err as string);
      }
    }
  }
  static async deleteSession(id: ActiveSessionId, authUserId: UserId) {
    try {
      const batch = db.batch();
      new ActiveSession(authUserId).delete(id, batch);
      return await batch.commit();
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        // throw new Error(`err: ${err.message}`);
        throw err; // TODO: convert to AppError with 500 error code
      } else {
        throw new Error(err as string);
      }
    }
  }
  static async deleteAllSession(id: UserId) {
    const sessonObj = new ActiveSession(id);
    const activeSessions = await sessonObj.getAll();
    if (activeSessions.length) {
      const batch = db.batch();
      sessonObj.deleteAll(
        activeSessions.map((as) => as.id),
        batch
      );
      await batch.commit();
    }
  }
}
