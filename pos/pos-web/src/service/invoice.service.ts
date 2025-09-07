import {
  InvoiceId,
  UserId,
  WithId,
  Invoice as InvoiceModel,
  ChartOfAccountId,
  ProductId,
} from "@pos/shared-models";
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

type Data = WithId<
  Pick<InvoiceModel, "specialDiscount" | "subject" | "items"> & {
    payments: Array<{ accountId: ChartOfAccountId; amount: number }>;
  }
>;

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
      (pre, curr) => pre + curr.qty * curr.rate - (curr.discount ?? 0),
      data.specialDiscount ? -data.specialDiscount : 0,
    );
    const { paymentIds, payments } = data.payments.reduce(
      (pre, curr) => {
        pre.paymentIds.push(curr.accountId);
        pre.payments[curr.accountId] = curr.amount;
        return pre;
      },
      { paymentIds: new Array<ChartOfAccountId>(), payments: Object() },
    );
    const batch = writeBatch(this.db);
    const nInvoice = this.add(
      batch,
      {
        status: INVOICE_STATUS.VALUES.Paid,
        totalAmount,
        specialDiscount: data.specialDiscount ?? null,
        subject: data.subject ?? null,
        items,
        targetUserId: null,
        paymentAccountIds: paymentIds,
        payments,
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
  async update(id: InvoiceId, updatedData: Data, oldData: InvoiceModel, updatedBy: UserId) {
    const batch = writeBatch(this.db);
    const { paymentIds, payments } = updatedData.payments.reduce(
      (pre, curr) => {
        pre.paymentIds.push(curr.accountId);
        pre.payments[curr.accountId] = curr.amount;
        return pre;
      },
      { paymentIds: new Array<ChartOfAccountId>(), payments: Object() },
    );
    //update invoice
    this.edit(
      batch,
      id,
      {
        items: updatedData.items,
        specialDiscount: updatedData.specialDiscount || null,
        paymentAccountIds: paymentIds,
        payments,
      },
      updatedBy,
    );

    //updatable products' qty
    const mutatedProductsQty: Record<ProductId, number> = {};
    oldData.items.forEach((oItem) => {
      const matchItem = updatedData.items.find((item) => item.productId === oItem.productId);
      const qtyDiff = (matchItem?.qty || 0) - oItem.qty;
      if (qtyDiff !== 0) {
        mutatedProductsQty[oItem.productId] = qtyDiff;
      }
    });
    updatedData.items
      .filter((item) => !oldData.items.find((oItem) => oItem.productId === item.productId))
      .forEach((item) => {
        mutatedProductsQty[item.productId] = item.qty;
      });

    //update qty in products
    const product = new Product(this.db);
    Object.entries(mutatedProductsQty).forEach(([productId, qty]) => {
      product.edit(batch, productId, { qty: increment(-qty) }, updatedBy);
    });
    return await batch.commit();
  }
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
