import { Shop as ShopModel, ShopId, UserId, WithId, ShopRole } from "@pos/shared-models";
import {
  arrayRemove,
  deleteField,
  Firestore,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { DocumentCounter } from "@/db-collections/documentCounter.collection";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
import { Shop } from "@/db-collections/shop.collection";
import { User } from "@/db-collections/user.collection";
import { Session } from "@/db-collections/session.collections";
import { apiProvider } from "@/utils/ApiProvider/ApiProvider";
type omitKeys =
  | "qty"
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";

type Data = WithId<Omit<ShopModel, omitKeys>>;
class ShopService {
  db: Firestore;
  constructor(db: Firestore) {
    this.db = db;
  }
  async create(data: Data, createdBy: UserId) {
    const shopObj = new Shop(this.db);
    try {
      const batch = writeBatch(this.db);
      shopObj.add(
        batch,
        {
          id: data.id,
          name: data.name,
          address: data.address ?? null,
          code: data.code,
          officials: null,
        },
        createdBy,
      );
      new DocumentCounter(this.db).incrementCounter(batch, DOCUMENT_FORMAT.VALUES.Shop);
      await batch.commit();
      return data.id;
    } catch (err) {
      console.log(err);
      throw new Error("Failed to create");
    }
  }
  async edit(id: ShopId, data: Partial<Data>, updatedBy: UserId) {
    try {
      const batch = writeBatch(this.db);
      const shopObj = new Shop(this.db);
      shopObj.edit(
        batch,
        id,
        {
          name: data.name,
          address: data.address || null,
          code: data.code,
          officials: data.officials ?? null,
        },
        updatedBy,
      );
      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  }
  //TODO: test whether working or not
  async delete(id: ShopId, updatedBy: UserId) {
    const now = serverTimestamp();
    try {
      const shopObj = new Shop(this.db);
      const shop = await shopObj.get(id);
      const batch = writeBatch(this.db);
      shopObj.remove(batch, id, updatedBy);
      const accessedUserIds = Object.keys(shop.officials ?? {});
      if (accessedUserIds.length) {
        //remove current shop access
        const userObj = new User(this.db);
        const accessedUsers = await userObj.getListByIds(accessedUserIds);
        accessedUsers.forEach((u) =>
          userObj.edit(
            batch,
            u.id,
            Object({ shopIds: arrayRemove(id), [`shopRoles.${id}`]: deleteField() }),
            updatedBy,
          ),
        );

        //remove shopId from all users' session
        const sessionObj = new Session(this.db);
        const targetSessions = await sessionObj.findBy(id);
        targetSessions.forEach((s) =>
          sessionObj.edit(batch, s.docRef, {
            shopId: deleteField(),
            shopRole: deleteField(),
            updatedAt: now,
          }),
        );
      }
      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  }
  async addShopAccess(
    shopId: ShopId,
    userId: UserId,
    shopRole: ShopRole,
    token: string,
    sessionId: string,
  ) {
    const res = await apiProvider.addShopAccess(shopId, userId, { shopRole }, token, sessionId);
    if (!res) {
      throw new Error(`Unable to connect server`);
    }
    return res;
  }
  async revokeShopAccess(shopId: ShopId, userId: UserId, token: string, sessionId: string) {
    const res = await apiProvider.revokeShopAccess(shopId, userId, token, sessionId);
    if (!res) {
      throw new Error(`Unable to connect server`);
    }
    return res;
  }
}
export default ShopService;
