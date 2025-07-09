import { CreateInvoiceInput } from "../schemas/invoice.schema";
import { InvoiceService } from "../services/invoice.service";
import { NextFunction, Request, Response } from "express";
import { CustomAuth } from "../models/common.model";

export class InvoiceMiddleware {
  static async create(
    req: Request<{}, {}, CreateInvoiceInput>,
    res: Response,
    next: NextFunction
  ) {
    const { authUserId } = res.locals as CustomAuth;
    const data = req.body;
    try {
      const newInvoice = await new InvoiceService().create(data, authUserId);
      const { deletedAt, isDeleted, deletedBy, updatedAt, updatedBy, ...rest } =
        newInvoice;
      res.status(200).json({ data: rest });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
}
