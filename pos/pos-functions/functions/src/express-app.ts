import createError from "http-errors";
import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import usersRouter from "./routes/users";
import indexRouter from "./routes/index";
import { AppError } from "./AppError";

config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Automatically allow cross-origin requests
const originList = JSON.parse(process.env.CORS_ORIGINS as string);
app.use(cors({ origin: originList }));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // @ts-ignore
  if (res.headerSent) {
    return next(err);
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.errors });
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
};
app.use(errorHandler);

export default app;
