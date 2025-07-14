import {
  ChartOfAccountId,
  WithId,
  ChartOfAccount as ChartOfAccountModel,
} from "@pos/shared-models";
import { Firestore, increment, writeBatch } from "firebase/firestore";
import { ChartOfAccount } from "@/db-collections/chartOfAccount.collection";
import { DocumentCounter } from "@/db-collections/documentCounter.collection";
import { DOCUMENT_FORMAT } from "@/constants/document-format";

type omitKeys =
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";
interface AccountTree extends Pick<ChartOfAccountModel, "name" | "parentId" | "normalBalance"> {
  path: string | null;
}
class ChartOfAccountService extends ChartOfAccount {
  db: Firestore;
  constructor(db: Firestore) {
    super(db);
    this.db = db;
  }
  async getByIdsWithPaths(ids: ChartOfAccountId[]) {
    const accountsMap: Record<ChartOfAccountId, AccountTree> = {};
    //update map with parent account's data & generate path
    for (const id of ids) {
      let currentId: string | null = id;
      const path = new Array<string>();
      while (currentId) {
        const cached: { name: string; parentId: string | null } = accountsMap[currentId];
        if (cached) {
          path.unshift(cached.name);
          currentId = cached.parentId;
        } else {
          const data = await this.get(currentId); //fetch new data
          accountsMap[currentId] = {
            name: data.name,
            parentId: data.parentId,
            normalBalance: data.normalBalance,
            path: null,
          };
          path.unshift(data.name);
          currentId = data.parentId;
        }
      }
      accountsMap[id].path = path.join(" → ");
    }
    return accountsMap;
  }
}
export default ChartOfAccountService;
