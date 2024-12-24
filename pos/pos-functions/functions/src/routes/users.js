import { db, auth } from "../firebase";
import express from "express";
import { config } from "dotenv";
import recaptchaAuthorization from "../middlewares/recaptcha-authorization.middleware";
import cors from "cors";
import bcrypt from "bcrypt";
import { UserMiddleware } from "../middlewares/user.middleware";

config();

// eslint-disable-next-line new-cap
const router = express.Router();
const originList = JSON.parse(process.env.CORS_ORIGINS);
const app = express();
app.use(express.json());
app.use(cors({ origin: originList }));

router.post(
  "/change-password",
  UserMiddleware.authorization,
  UserMiddleware.updatePassword
);
router.put("/:id", UserMiddleware.authorization, UserMiddleware.update);

export default router;
