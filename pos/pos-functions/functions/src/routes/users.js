import { db, auth } from "../firebase";
import express from "express";
import { config } from "dotenv";
import recaptchaAuthorization from "../middlewares/recaptcha-authorization.middleware";
import cors from "cors";
import bcrypt from "@node-rs/bcrypt";
import { UserMiddleware } from "../middlewares/user.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { RoleMiddleware } from "../middlewares/role.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  updateOwnUserSchema,
  updateUserPasswordSchema,
  updateUserStatusSchema,
} from "../schemas/user.schema";

config();

// eslint-disable-next-line new-cap
const router = express.Router();
const originList = JSON.parse(process.env.CORS_ORIGINS);
const app = express();
app.use(express.json());
app.use(cors({ origin: originList }));

router.put(
  "/change-password",
  AuthMiddleware.isAuthenticated,
  validateRequest(updateUserPasswordSchema),
  UserMiddleware.updatePassword
);
router.patch(
  "/:id",
  AuthMiddleware.isAuthenticated,
  validateRequest(updateOwnUserSchema),
  UserMiddleware.update
);
router.patch(
  "/:id/status",
  AuthMiddleware.isAuthenticated,
  RoleMiddleware.isAdmin,
  validateRequest(updateUserStatusSchema),
  UserMiddleware.updateStatus
);

export default router;
