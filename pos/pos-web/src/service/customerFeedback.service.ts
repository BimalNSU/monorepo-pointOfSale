import {
  CustomerFeedback as FeedbackModel,
  UserId,
  WithId,
  CustomerFeedbackId,
} from "@pos/shared-models";
import { Firestore, writeBatch } from "firebase/firestore";
import { DocumentCounter } from "@/db-collections/documentCounter.collection";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
import { CustomerFeedback } from "@/db-collections/customerFeedback.collection";
type omitKeys =
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";
type AddData = WithId<Omit<FeedbackModel, omitKeys>>;

class CustomerFeedbackService {
  db: Firestore;
  constructor(db: Firestore) {
    this.db = db;
  }
  async create(data: AddData, createdBy: UserId) {
    const feedbackObj = new CustomerFeedback(this.db);
    const batch = writeBatch(this.db);
    const { customerName, ...rest } = data;
    feedbackObj.add(batch, { ...rest, customerName: customerName.trim() }, createdBy);
    new DocumentCounter(this.db).incrementCounter(batch, DOCUMENT_FORMAT.VALUES.CustomerFeedback);
    return await batch.commit();
  }
  //   async softDelete(id: CustomerFeedbackId, deletedBy: UserId) {
  //     const feedbackObj = new CustomerFeedback(this.db);
  //     const batch = writeBatch(this.db);
  //     feedbackObj.edit(batch, id, { isDeleted: true, updatedBy: deletedBy, deletedBy });
  //     return await batch.commit();
  //   }
  //   async softDeletes(ids: CustomerFeedbackId[], deletedBy: UserId) {
  //     const customerObj = new Customer(this.db);
  //     const batch = writeBatch(this.db);
  //     ids.forEach((id) =>
  //       customerObj.edit(batch, id, { isDeleted: true, updatedBy: deletedBy, deletedBy }),
  //     );
  //     return await batch.commit();
  //   }
  //   async restore(ids: CustomerFeedbackId[], updatedBy: UserId) {
  //     const customerObj = new Customer(this.db);
  //     const batch = writeBatch(this.db);
  //     ids.forEach((id) => customerObj.restore(batch, id, updatedBy));
  //     return await batch.commit();
  //   }
}
export default CustomerFeedbackService;
