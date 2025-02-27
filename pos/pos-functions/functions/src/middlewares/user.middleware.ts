import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { MutableData, UserService } from "../services/user.service";
import { UserId } from "../models/common.model";
import bcrypt from "@node-rs/bcrypt";
import { auth } from "../firebase";

// gradually UserMiddleware will be used everywhere instead of "user-authoriztion.middleware.js" file
export class UserMiddleware {
  static async login(req: Request, res: Response, next: NextFunction) {
    const loginWith = req.body.loginWith;
    const userService = new UserService();
    const fieldName = UserMiddleware.getLoginType(loginWith);
    try {
      const userData =
        fieldName === "id"
          ? await userService.findOne(loginWith)
          : await userService.findOneBy(fieldName, loginWith);
      if (!userData) {
        // when userId or mobile or email don't match
        return res.status(401).json({ error: "Authentication failed!" });
      }
      const { password, ...restData } = userData;
      const isValidPassword = await bcrypt.compare(req.body.password, password);
      if (!isValidPassword) {
        // when password doesn't match
        return res.status(401).json({ error: "Authentication failed!" });
      }

      try {
        const token = await auth.createCustomToken(userData.id);
        return res.status(200).json({
          accessToken: token,
          userData: restData,
          currentLoginType: fieldName,
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
  static async authorization(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      res.locals.authUserId = await AuthService.authorization(authorization);
      return next();
    } catch (err) {
      next(err);
    }
  }
  static async create(req: Request, res: Response, next: NextFunction) {
    const { authUserId } = res.locals;
    const { id, ...rest } = { ...req.body } as MutableData & { id: UserId }; // extract post-data
    try {
      const nUser = await new UserService().create(rest, authUserId);
      return res
        .status(201)
        .json({ data: nUser, message: "Successfully added new user" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
  static async update(req: Request, res: Response, next: NextFunction) {
    const { authUserId } = res.locals;
    const { id: userId } = req.params;
    const newData = { ...req.body } as MutableData; // extract post-data
    try {
      const nUser = await new UserService().update(userId, newData, authUserId);
      return res
        .status(200)
        .json({ message: "User updated successfully", user: nUser });
    } catch (error) {
      console.error("Error updating user", error);
      return res.status(500).json({ error: error });
    }
  }
  static async delete(req: Request, res: Response, next: NextFunction) {
    const { authUserId } = res.locals;
    const { id } = req.params;
    try {
      await new UserService().delete(id, authUserId);
      return res.status(200).json({
        message: "User deleted successfully",
        userId: id,
        deletedAt: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
  static async updatePassword(req: Request, res: Response, next: NextFunction) {
    const { authUserId } = res.locals;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Bad request" });
    }
    const userService = new UserService();
    const user = await userService.findOne(authUserId);
    try {
      const isMatched = await bcrypt.compare(currentPassword, user.password);
      if (!isMatched) {
        return res.status(401).json("Wrong password.");
      }
      const newHash = await bcrypt.hash(newPassword, 10);
      await userService.update(authUserId, { password: newHash }, authUserId);
      return res
        .status(200)
        .json({ message: "Password changed successfully." });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
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
}
