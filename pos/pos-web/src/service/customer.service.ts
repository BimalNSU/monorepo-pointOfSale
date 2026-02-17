import { Customer as CustomerModel, UserId, WithId, CustomerId } from "@pos/shared-models";
import { Firestore, writeBatch } from "firebase/firestore";
import { Customer } from "@/db-collections/customer.collection";
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
type AddData = WithId<Omit<CustomerModel, omitKeys>>;
type EditData = Partial<Omit<CustomerModel, omitKeys>>;

class CustomerService {
  db: Firestore;
  constructor(db: Firestore) {
    this.db = db;
  }
  private normalizeCloths(cloths: CustomerModel["cloths"] | undefined) {
    if (!cloths) return [];
    return cloths.map((c) => {
      const { info, ...rest } = c;
      return {
        ...rest,
        info: {
          ...info,
          remark: c.info.remark ?? null, // set remark to null if undefined
        },
      };
    });
  }
  async add(data: AddData, createdBy: UserId) {
    const customerObj = new Customer(this.db);
    const batch = writeBatch(this.db);
    const { lastName, email, cloths, ...rest } = data;
    customerObj.add(
      {
        ...rest,
        lastName: lastName || null,
        email: email || null,
        cloths: this.normalizeCloths(cloths),
        createdBy,
        updatedBy: createdBy,
      },
      batch,
    );
    new DocumentCounter(this.db).incrementCounter(batch, DOCUMENT_FORMAT.VALUES.Customer);
    return await batch.commit();
  }
  async update(id: CustomerId, updateData: EditData, updatedBy: UserId) {
    const batch = writeBatch(this.db);
    const customerObj = new Customer(this.db);
    customerObj.edit(batch, id, {
      ...updateData,
      cloths: this.normalizeCloths(updateData.cloths),
      updatedBy,
    });
    return await batch.commit();
  }
  async softDelete(id: CustomerId, deletedBy: UserId) {
    const customerObj = new Customer(this.db);
    const batch = writeBatch(this.db);
    customerObj.edit(batch, id, { isDeleted: true, updatedBy: deletedBy, deletedBy });
    return await batch.commit();
  }
  async softDeletes(ids: CustomerId[], deletedBy: UserId) {
    const customerObj = new Customer(this.db);
    const batch = writeBatch(this.db);
    ids.forEach((id) =>
      customerObj.edit(batch, id, { isDeleted: true, updatedBy: deletedBy, deletedBy }),
    );
    return await batch.commit();
  }
  async restore(ids: CustomerId[], updatedBy: UserId) {
    const customerObj = new Customer(this.db);
    const batch = writeBatch(this.db);
    ids.forEach((id) => customerObj.restore(batch, id, updatedBy));
    return await batch.commit();
  }
}
export default CustomerService;
