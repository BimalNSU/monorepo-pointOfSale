import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: err.errors,
        });
      } else {
        res.status(500).json({
          message: "Unexpected server error",
          error: String(err),
        });
      }
    }
  };
};
