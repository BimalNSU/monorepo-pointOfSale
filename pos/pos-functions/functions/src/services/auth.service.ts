import { AppError } from "../AppError";
import { auth } from "../firebase";
export class AuthService {
  static async authorization(authorization: string) {
    try {
      const pattern = new RegExp(`(^${"Bearer "})`, "gi");
      const idToken = authorization.replace(pattern, "");
      const decodedToken = await auth.verifyIdToken(idToken);
      if (!decodedToken.uid) {
        throw new AppError(
          401,
          "Unauthorized",
          "Id token isn't matched. Error raises from AuthService.authorization service layer"
        );
      }
      return decodedToken.uid;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        // throw new Error(`err: ${err.message}`);
        throw err; // TODO: convert to AppError with 500 error code
      } else {
        throw new Error(err as string);
      }
    }
  }
}
