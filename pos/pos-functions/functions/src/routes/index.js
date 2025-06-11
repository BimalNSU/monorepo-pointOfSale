import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { UserMiddleware } from "../middlewares/user.middleware";
import recaptchaAuthorization from "../middlewares/recaptcha-authorization.middleware";

config();

// eslint-disable-next-line new-cap
const router = express.Router();
const originList = JSON.parse(process.env.CORS_ORIGINS);
const app = express();
app.use(express.json());
app.use(cors({ origin: originList }));

router.post("/auth/login", UserMiddleware.login);
// router.post("/auth/login/", UserMiddleware.login);
router.post(
  "/admin/users/",
  UserMiddleware.authorization,
  UserMiddleware.create
);
router.put(
  "/sessions/:id",
  UserMiddleware.authorization,
  UserMiddleware.updateSession
);
router.delete(
  "/sessions/:id",
  UserMiddleware.authorization,
  UserMiddleware.removeSession
);

// router.put("/properties/:id/", userAuthorization, async (req, res) => {
//   const { uid } = res.locals;
//   const propertyId = req.params.id; // extract post-data
//   const data = { ...req.body }; // extract post-data
//   try {
//     const dbProperty = await new Property().get(propertyId);
//     if (!dbProperty) {
//       return res.status(401).json({ error: "incorrect data" });
//     }
//     const property =
//       dbProperty.type === "residential"
//         ? new ResidentialProperty()
//         : dbProperty.type === "commercial"
//         ? new CommercialProperty()
//         : null;

//     const isModified = await property.update(propertyId, data, dbProperty, uid);
//     return isModified
//       ? res.status(200).json({ success: "property is updated successfully" })
//       : res.status(401).json({ error: "error" });
//     // return res.status(401).json({ error: "property isn't created" });
//   } catch (error) {
//     res.status(500).json({ error: "error" });
//   }
// });
// router.delete("/properties/:id/", userAuthorization, async (req, res) => {
//   const { uid } = res.locals;
//   const id = req.params.id; // extract post-data
//   try {
//     const property = new Property();
//     const isModified = await property.delete(id);
//     return isModified
//       ? res.status(200).json({ success: "property is deleted successfully" })
//       : res.status(401).json({ error: "error" });
//     // return res.status(401).json({ error: "property isn't created" });
//   } catch (error) {
//     res.status(500).json({ error: "error" });
//   }
// });

// router.post(
//   "/invoices",
//   UserMiddleware.authorization,
//   InvoiceMiddleware.create
// );

router.get("/help", async (req, res) => {
  try {
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
