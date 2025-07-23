import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const rawErrors = err.flatten().fieldErrors;

        const fieldErrors = Object.entries(rawErrors).reduce(
          (acc, [key, val]) => {
            if (val !== undefined) acc[key] = val;
            return acc;
          },
          {} as Record<string, string[]>
        );

        return next(new AppError("Validation failed", 400, fieldErrors));
      }

      next(err); // unexpected error
    }
  };
};
