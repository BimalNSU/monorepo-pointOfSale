import createError from "http-errors";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import adminRouter from "./routes/admin";
import usersRouter from "./routes/users";
import indexRouter from "./routes/index";
import { errorHandler } from "./middlewares/errorHandler.middleware";

config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Automatically allow cross-origin requests
const originList = JSON.parse(process.env.CORS_ORIGINS as string);
app.use(cors({ origin: originList }));

app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, "Route not found"));
});

app.use(errorHandler); // after all routes

export default app;
