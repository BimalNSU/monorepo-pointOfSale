import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import bcrypt from "@node-rs/bcrypt";
import { auth } from "../firebase";
import { Session } from "../db-collections/session.collection";
import { Session as SessionModel } from "@pos/shared-models";
import { UAParser } from "ua-parser-js";
import { CustomAuth } from "../models/common.model";
import { UpdateSessionInput } from "../schemas/session.schema";

export class AuthMiddleware {
  static async login(req: Request, res: Response, next: NextFunction) {
    const forwarded = req.headers["x-forwarded-for"]; //for proxy or load balancer
    const ip =
      typeof forwarded === "string"
        ? forwarded.split(",")[0]
        : req.socket?.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const parser = new UAParser(userAgent);
    const ua = parser.getResult();
    const clientInfo = {
      ip,
      browser: ua.browser.name,
      os: ua.os.name,
      device: ua.device.type || "desktop",
      userAgent,
    };

    const loginWith = req.body.loginWith;
    const userService = new UserService();
    const fieldName = AuthMiddleware.getLoginType(loginWith);
    try {
      const userData =
        fieldName === "id"
          ? await userService.findOne(loginWith)
          : await userService.findOneBy(fieldName, loginWith);
      if (!userData) {
        // when userId or mobile or email don't match
        return res.status(401).json({ error: "Authentication failed!" });
      }
      if (!userData.isActive) {
        return res
          .status(403)
          .json({ error: "Your account is inactive. Please contact admin." });
      }
      const { password, ...restData } = userData;
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        password ?? ""
      );
      if (!isValidPassword) {
        // when password doesn't match
        return res.status(401).json({ error: "Authentication failed!" });
      }

      try {
        const token = await auth.createCustomToken(userData.id);
        const now = new Date();
        let allowedShopRole: Pick<SessionModel, "shopId" | "shopRole"> = {};
        const allowedShopIds = Object.keys(userData.shopRoles ?? {});
        if (allowedShopIds.length) {
          allowedShopRole = {
            shopId: allowedShopIds[0],
            shopRole: (userData.shopRoles ?? {})[allowedShopIds[0]],
          };
        }
        const { id: sessionId } = await new Session().create({
          userId: userData.id,
          role: userData.role,
          ...allowedShopRole,
          lastLogin: now,
          ip: clientInfo.ip ?? "",
          device: clientInfo.device,
          createdAt: now,
          updatedAt: now,
        });
        return res.status(200).json({
          accessToken: token,
          userData: restData,
          currentLoginType: fieldName,
          sessionId,
        });
      } catch (error) {
        return res.status(500).json({ error: error });
      }
      // const token = jwt.sign(
      //   {
      //     uid: userData.uid,
      //     firstName: userData.firstName,
      //     lastName: userData.lastName,
      //     role: userData.role,
      //     mobile: userData.mobile,
      //     email: userData.email,
      //   },
      //   process.env.JWT_SECRET,
      //   { algorithm: process.env.JWT_ALGORITHM }
      // );
    } catch {
      return res.status(500).json({ error: "Server error" });
    }
  }
  static getLoginType(loginWith: string) {
    const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const bdMobilePattern = /^01[3,5-9]\d{8}$/;
    if (emailPattern.test(loginWith)) {
      return "email";
    } else if (bdMobilePattern.test(loginWith)) {
      return "mobile";
    } else {
      return "id";
    }
  }
  static async isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { authorization, session_id } = req.headers as {
        authorization: string;
        session_id: string;
      };
      if (!authorization || !session_id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { uid } = await AuthService.authorization(authorization);
      const dbSession = await AuthService.getSession(session_id);
      if (!dbSession || dbSession.userId !== uid) {
        return res.status(403).json({ error: "Invalid session" });
      }
      res.locals = {
        authUserId: uid,
        session: {
          id: session_id,
          userId: dbSession.userId,
          role: dbSession.role,
          shopId: dbSession.shopId,
          shopRole: dbSession.shopRole,
        },
      };
      return next();
    } catch (err) {
      next(err);
    }
  }
  static async updateSession(
    req: Request<{}, {}, UpdateSessionInput>,
    res: Response,
    next: NextFunction
  ) {
    const { authUserId, session } = res.locals as CustomAuth;
    const reqData = req.body;
    try {
      await AuthService.updateSession(session.id, reqData, authUserId);
      return res
        .status(200)
        .json({ message: "Session is updated successfully." });
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }
  static async removeSession(req: Request, res: Response, next: NextFunction) {
    const { session } = res.locals as CustomAuth;
    try {
      await AuthService.deleteSession(session.id);
      return res
        .status(200)
        .json({ message: "Session is removed successfully." });
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }
}
