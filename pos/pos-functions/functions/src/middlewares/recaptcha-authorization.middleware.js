import { auth } from "../firebase";
import axios from "axios";

const PRIVATE_KEY = process.env.RECAPTCHA_SERVER_SITE_KEY;

async function recaptchaAuthorization(req, res, next) {
  console.log("req", req);
  try {
    // const { authorization } = req.headers;
    // const token = authorization.split(" ")[1];
    // const pattern = new RegExp(`(^${"Bearer "})`, "gi");
    // const captchaToken = authorization.replace(pattern, "");
    const { recaptchaToken } = req.body;
    const res = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${PRIVATE_KEY}&response=${recaptchaToken}`
    );
    // Extract result from the API response
    if (res.data.success) {
      return next();
    }
    res.status(401).json({ error: "Your are not human" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

export default recaptchaAuthorization;
