import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UserId } from "@pos/shared-models";
import bcrypt from "@node-rs/bcrypt";
import { CustomAuth } from "../models/common.model";
import {
  CreateUserInput,
  UpdateUserInput,
  UpdateUserPasswordInput,
  UpdateUserStatusInput,
} from "../schemas/user.schema";

export class UserMiddleware {
  static async create(
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
  ) {
    const { authUserId } = res.locals as CustomAuth;
    const userData = req.body;
    try {
      const nUser = await new UserService().create(userData, authUserId);
      return res
        .status(201)
        .json({ data: nUser, message: "User created successfully!" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
  //Only admin can call
  //TODO: test
  static async update(
    req: Request<{ id: UserId }, {}, UpdateUserInput>,
    res: Response,
    next: NextFunction
  ) {
    const { authUserId } = res.locals as CustomAuth;
    const { id: userId } = req.params;
    const updates = req.body;
    try {
      const nUser = await new UserService().update(userId, updates, authUserId);
      return res
        .status(200)
        .json({ message: `User ${userId} updated successfully.`, user: nUser });
    } catch (error) {
      console.error("Error updating user", error);
      return res.status(500).json({ error: error });
    }
  }
  //Only admin can call
  static async updateStatus(
    req: Request<{ id: UserId }, {}, UpdateUserStatusInput>,
    res: Response,
    next: NextFunction
  ) {
    const { authUserId } = res.locals as CustomAuth;
    const { id: userId } = req.params;
    const updates = { ...req.body };
    try {
      await new UserService().updateStatus(userId, updates, authUserId);
      return res.status(200).json({
        message: `User ${userId} updated successfully.`,
        data: updates,
      });
    } catch (error) {
      console.error("Error updating user", error);
      return res.status(500).json({ error: error });
    }
  }
  static async updatePassword(
    req: Request<{}, {}, UpdateUserPasswordInput>,
    res: Response,
    next: NextFunction
  ) {
    const { authUserId } = res.locals as CustomAuth;
    const { currentPassword, newPassword } = req.body;
    const userService = new UserService();
    const user = await userService.findOne(authUserId);
    try {
      const isMatched = await bcrypt.compare(
        currentPassword,
        user.password ?? ""
      );
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
}
