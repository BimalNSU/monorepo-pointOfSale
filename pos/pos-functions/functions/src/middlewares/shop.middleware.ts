import { NextFunction, Request, Response } from "express";
import { ShopService } from "../services/shop.service";

export class ShopMiddleware {
  static async addShopAccess(req: Request, res: Response, next: NextFunction) {
    const { id: shopId, employeeId } = req.params;
    try {
      await new ShopService().assignRole(shopId, employeeId, req.body.shopRole);
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
    try {
      await new ShopService().revokeShopRole(shopId, employeeId);
      res.status(200).json({
        message: `Employee access revoked`,
      });
    } catch (err) {
      next(err); // will be handled by centralized errorHandler
    }
  }
}
