import {
  User as UserModel,
  ProductId,
  ShopId,
  UserId,
  WithId,
  User,
  ActiveSessionId,
} from "@pos/shared-models";
import { Firestore, writeBatch } from "firebase/firestore";
import { DocumentCounter } from "@/db-collections/documentCounter.collection";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
// import CustomAuthService from "./customAuth.service";
import { ShopRole, UserRole } from "@pos/shared-models";
import { apiProvider } from "@/utils/ApiProvider/ApiProvider";
type omitKeys =
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";
type AddData = Omit<UserModel, omitKeys>;
type EditData = Omit<UserModel, omitKeys>;
// type PartialAuthData = { userId: UserId; role: UserRole; shopId?: ShopId; shopRole: ShopRole };
class UserService {
  db: Firestore;
  constructor(db: Firestore) {
    this.db = db;
  }
  async add(data: AddData, idToken: string, sessionId: ActiveSessionId) {
    await apiProvider.addUserByAdmin(data, idToken, sessionId);
  }
  async update(id: UserId, newData: EditData, idToken: string, sessionId: ActiveSessionId) {
    //TODO
  }
  async updateStatus(
    id: UserId,
    newData: Partial<Pick<User, "isActive" | "isDeleted">>,
    token: string,
    sessionId: string,
  ) {
    return await apiProvider.updateUserStatus(id, newData, token, sessionId);
  }
}
export default UserService;
