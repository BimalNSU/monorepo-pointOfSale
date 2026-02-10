import { NextFunction, Request, Response } from "express";
import { ShopService } from "../services/shop.service";
import { ShopId } from "@pos/shared-models";
import { CustomAuth } from "src/models/common.model";

export class ShopMiddleware {
  static async removeShop(
    req: Request<{ id: ShopId }, {}>,
    res: Response,
    next: NextFunction,
  ) {
    const { id: shopId } = req.params;
    const { authUserId } = res.locals as CustomAuth;
    try {
      await new ShopService().remove(shopId, authUserId);
      res.status(200).json({
        message: `Shop removed successfully`,
      });
    } catch (err) {
      next(err); // will be handled by centralized errorHandler
    }
  }
  static async addShopAccess(req: Request, res: Response, next: NextFunction) {
    const { id: shopId, employeeId } = req.params;
    const { authUserId } = res.locals as CustomAuth;
    try {
      await new ShopService().assignRole(
        shopId,
        employeeId,
        req.body.shopRole,
        authUserId,
      );
      res.status(200).json({
        message: `Role updated successfully`,
      });
    } catch (err) {
      next(err); // will be handled by centralized errorHandler
    }
  }
  static async revokeShopAccess(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { id: shopId, employeeId } = req.params;
    const { authUserId } = res.locals as CustomAuth;
    try {
      await new ShopService().revokeShopRole(shopId, employeeId, authUserId);
      res.status(200).json({
        message: `Employee access revoked`,
      });
    } catch (err) {
      next(err); // will be handled by centralized errorHandler
    }
  }
}
