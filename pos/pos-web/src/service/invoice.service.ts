import { InvoiceId, UserId, WithId, Invoice as InvoiceModel } from "@pos/shared-models";
import { Firestore, increment, writeBatch } from "firebase/firestore";
import { Invoice } from "@/db-collections/invoice.collection";
import { INVOICE_STATUS } from "@/constants/paymentStatus";
import { DocumentCounter } from "@/db-collections/documentCounter.collection";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
import { Product } from "@/db-collections/product.collection";

type omitKeys =
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";

type Data = WithId<Pick<InvoiceModel, "discount" | "subject" | "items">>;

class InvoiceService extends Invoice {
  db: Firestore;
  constructor(db: Firestore) {
    super(db);
    this.db = db;
  }
  async create(data: Data, createdBy: UserId) {
    const items = Object.values(data.items).map((item) => {
      const { discount, ...rest } = item;
      return { ...rest, discount: discount ?? null };
    });
    const totalAmount = items.reduce(
      (pre, curr) => pre + curr.qty * curr.rate,
      -(data.discount ?? 0),
    );
    const batch = writeBatch(this.db);
    const nInvoice = this.add(
      batch,
      {
        status: INVOICE_STATUS.VALUES.Paid,
        totalAmount,
        discount: data.discount ?? null,
        subject: data.subject ?? null,
        items,
        targetUserId: null,
      },
      createdBy,
      data.id,
    );
    new DocumentCounter(this.db).incrementCounter(batch, DOCUMENT_FORMAT.VALUES.Invoice);

    //update qty in products
    const product = new Product(this.db);
    data.items.forEach(
      (item) => product.edit(batch, item.productId, { qty: increment(-item.qty) }, createdBy), //decreasing qty
    );
    await batch.commit();
    return await this.get(nInvoice.id);
  }
  // async update(id: InvoiceId, data: InvoiceMutPayment, updatedBy: UserId) {
  //   const batch = writeBatch(this.firestore);
  //   this.edit(batch, id, data, updatedBy);
  //   await batch.commit();
  // }
  async delete(id: InvoiceId, deletedBy: UserId) {
    try {
      const batch = writeBatch(this.db);
      this.remove(batch, id, deletedBy);
      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  }
  async bulkDelete(ids: InvoiceId[], deletedBy: UserId) {
    try {
      const batch = writeBatch(this.db);
      ids.forEach((id) => this.remove(batch, id, deletedBy));
      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  }
}
export default InvoiceService;
