import { Session as SessionModel, SessionId, UserId } from "@pos/shared-models";
import { AppError } from "../utils/AppError";
import { auth, db } from "../firebase";
import { UserService } from "./user.service";
import { Session } from "../db-collections/session.collection";
import { WriteBatch } from "firebase-admin/firestore";

export class AuthService {
  async authorization(authorization: string) {
    try {
      const pattern = new RegExp(`(^${"Bearer "})`, "gi");
      const idToken = authorization.replace(pattern, "");
      const decodedToken = await auth.verifyIdToken(idToken);
      if (!decodedToken.uid) {
        throw new AppError("Unauthorized", 401);
      }
      return decodedToken;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        console.error("Unexpected error in authorization:", err);
        throw new AppError(err.message || "Internal Server Error", 500);
      } else {
        throw new AppError("Unknown error occurred", 500);
      }
    }
  }
  async getSession(sessionId: SessionId) {
    return await new Session().get(sessionId);
  }
  async updateSession(
    sessionId: SessionId,
    sessionData: Pick<SessionModel, "role" | "shopId" | "shopRole">,
    authUserId: UserId,
  ) {
    try {
      const userService = new UserService();
      const user = await userService.findOne(authUserId);
      if (
        sessionData.shopId &&
        sessionData.shopRole &&
        (user.shopRoles ?? {})[sessionData.shopId] !== sessionData.shopRole
      ) {
        throw new AppError("Unauthorized role switching", 401);
      }
      const batch = db.batch();
      new Session().update(sessionId, sessionData, batch);
      return await batch.commit();
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        console.error("Unexpected error in updateSession:", err);
        throw new AppError(err.message || "Internal Server Error", 500);
      } else {
        throw new AppError("Unknown error occurred", 500);
      }
    }
  }
  async deleteSession(id: SessionId) {
    try {
      const batch = db.batch();
      new Session().delete(id, batch);
      return await batch.commit();
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        console.error("Unexpected error in deleteSession:", err);
        throw new AppError(err.message || "Internal Server Error", 500);
      } else {
        throw new AppError("Unknown error occurred", 500);
      }
    }
  }
  async deleteAllSession(id: UserId, writeBatch?: WriteBatch) {
    try {
      const sessionObj = new Session();
      const targetSessions = await sessionObj.findBy({ userId: id });
      if (targetSessions.length) {
        const batch = writeBatch ?? db.batch();
        sessionObj.deleteAll(
          targetSessions.map((s) => s.id),
          batch,
        );
        if (!writeBatch) {
          await batch.commit();
        }
      }
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        console.error("Unexpected error in deleteAllSession:", err);
        throw new AppError(err.message || "Internal Server Error", 500);
      } else {
        throw new AppError("Unknown error occurred", 500);
      }
    }
  }
}
