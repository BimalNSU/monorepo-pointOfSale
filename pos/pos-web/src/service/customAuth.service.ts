import { User } from "@/db-collections/user.collection";
import { ShopRole, USER_ROLE, UserRole } from "@pos/shared-models";
import { ShopId, UserId } from "@pos/shared-models";
import { Firestore } from "firebase/firestore";

type Data = { userId: UserId; role: UserRole; shopId?: ShopId; shopRole?: ShopRole };
class CustomAuthService {
  db: Firestore;
  constructor(db: Firestore) {
    this.db = db;
  }
  async validate(data: Data) {
    const userObj = new User(this.db);
    try {
      const dbUser = await userObj.get(data.userId);
      if (
        dbUser.role === USER_ROLE.VALUES.Admin ||
        (dbUser.role === data.role && data.shopId && (dbUser.shopRoles ?? {})[data.shopId])
      ) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      throw new Error();
    }
  }
}
export default CustomAuthService;
