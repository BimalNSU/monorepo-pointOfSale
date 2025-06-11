import {
  ActiveSession as ActiveSessionModel,
  ActiveSessionId,
  UserId,
} from "@pos/shared-models";
import { AppError } from "../AppError";
import { auth } from "../firebase";
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

      return await new ActiveSession(authUserId).update(sessionId, sessionData);
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
      const userService = new UserService();
      const user = await userService.findOne(authUserId);
      const sessionObj = new ActiveSession(authUserId);
      const sessionData = await sessionObj.get(id);
      if (!sessionData) {
        throw new AppError(401, "Unauthorized session update");
      }
      if (
        sessionData.role !== user.role ||
        (sessionData.shopRole &&
          sessionData.shopId &&
          (user.shopRoles ?? {})[sessionData.shopId] !== sessionData.shopRole)
      ) {
        throw new AppError(401, "Unauthorized role switching");
      }
      return await new ActiveSession(authUserId).delete(id);
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
}
