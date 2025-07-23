import { User as UserModel, UserId, SessionId } from "@pos/shared-models";
import { Firestore, writeBatch } from "firebase/firestore";
// import CustomAuthService from "./customAuth.service";
import { apiProvider } from "@/utils/ApiProvider/ApiProvider";
import { AxiosResponse } from "axios";
import { FirebaseStorage } from "firebase/storage";
import { deleteFileFromFirebase, uploadUserProfile } from "@/api/common/commonFunctions";
import { User } from "@/db-collections/user.collection";
type omitKeys =
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";
type AddData = Omit<UserModel, omitKeys>;
type EditData = Partial<Omit<UserModel, omitKeys>>;

class UserService {
  db: Firestore;
  constructor(db: Firestore) {
    this.db = db;
  }
  async add(data: AddData, idToken: string, sessionId: SessionId): Promise<AxiosResponse> {
    const res = await apiProvider.addUserByAdmin(data, idToken, sessionId);
    if (!res) {
      throw new Error(`Unable to connect server`);
    }
    return res;
  }
  async updateByAdmin(
    id: UserId,
    updateData: EditData,
    idToken: string,
    sessionId: SessionId,
  ): Promise<AxiosResponse> {
    const res = await apiProvider.updateUserByAdmin(id, updateData, idToken, sessionId);
    if (!res) {
      throw new Error(`Unable to connect server`);
    }
    return res;
  }
  async updateStatus(
    id: UserId,
    newData: Partial<Pick<UserModel, "isActive" | "isDeleted">>,
    token: string,
    sessionId: string,
  ): Promise<AxiosResponse> {
    const res = await apiProvider.updateUserStatus(id, newData, token, sessionId);
    if (!res) {
      throw new Error(`Unable to connect server`);
    }
    return res;
  }
  async updateProfileImage(
    storage: FirebaseStorage,
    id: UserId,
    imageData: { oldImagePath?: string; newImageFile: File },
    updatedBy: UserId,
  ) {
    try {
      const fullPath = await uploadUserProfile(storage, id, imageData.newImageFile);
      const batch = writeBatch(this.db);
      new User(this.db).edit(batch, id, { profileImage: fullPath }, updatedBy);

      //remove old image
      if (imageData.oldImagePath) {
        await deleteFileFromFirebase(storage, imageData.oldImagePath);
      }
      await batch.commit();
      return fullPath;
    } catch (e) {
      throw new Error(`Fail to add profile image`);
    }
  }
}
export default UserService;
