// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Let Express handle if headers already sent
  if (res.headersSent) return next(err);

  const statusCode = err.statusCode || err.status || 500;

  // Handle AppError (your custom business or validation errors)
  if (err instanceof AppError) {
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Validation failed",
      errors: err.errors || {},
    });
  }

  // Handle `http-errors` 404 or others
  if (err.name === "HttpError" || err.expose) {
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Not Found",
      errors: {},
    });
  }

  // Fallback: Internal server error
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
    errors: {},
  });
};
