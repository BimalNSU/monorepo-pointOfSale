import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { UserMiddleware } from "../middlewares/user.middleware";
import recaptchaAuthorization from "../middlewares/recaptcha-authorization.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { RoleMiddleware } from "../middlewares/role.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  createUserSchema,
  updateOwnUserSchema,
  updatePasswordByAdminSchema,
  updateUserPasswordSchema,
  updateUserSchema,
  updateUserStatusSchema,
} from "../schemas/user.schema";
import { BkashMiddleware } from "../middlewares/bkash.middleware";
import { createInvoiceSchema } from "../schemas/invoice.schema";
import { InvoiceMiddleware } from "../middlewares/invoice.middleware";
import { createShopAccessSchema } from "../schemas/shopAccess.schema";
import { ShopMiddleware } from "src/middlewares/shop.middleware";

config();

// eslint-disable-next-line new-cap
const router = express.Router();
const originList = JSON.parse(process.env.CORS_ORIGINS);
const app = express();
app.use(express.json());
app.use(cors({ origin: originList }));

router.post(
  "/users/",
  AuthMiddleware.isAuthenticated,
  RoleMiddleware.isAdmin,
  validateRequest(createUserSchema),
  UserMiddleware.create,
);
router.put(
  "/users/:id",
  AuthMiddleware.isAuthenticated,
  RoleMiddleware.isAdmin,
  validateRequest(updateUserSchema),
  UserMiddleware.updatedByAdmin,
);
router.patch(
  "/users/:id/status",
  AuthMiddleware.isAuthenticated,
  RoleMiddleware.isAdmin,
  validateRequest(updateUserStatusSchema),
  UserMiddleware.updateStatus,
);
router.patch(
  "/users/:id/password",
  AuthMiddleware.isAuthenticated,
  RoleMiddleware.isAdmin,
  validateRequest(updatePasswordByAdminSchema),
  UserMiddleware.updatePasswordByAdmin,
);
export default router;
