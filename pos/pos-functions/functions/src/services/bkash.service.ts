import { BkashTransaction } from "../db-collections/bkashTransaction.collection";
import {
  BkashTransactionId,
  BkashTransaction as TransactionModel,
} from "@pos/shared-models";

export class BkashService {
  async create(
    data: Omit<TransactionModel, "createdAt">,
    trxID: BkashTransactionId
  ) {
    return new BkashTransaction().create(
      { ...data, createdAt: new Date() },
      trxID
    );
  }
}
