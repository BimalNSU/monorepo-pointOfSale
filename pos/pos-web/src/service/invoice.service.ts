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
import ProductService from "./product.service";

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
    const productService = new ProductService(this.db);
    const productObj = new Product(this.db);
    const products = await productObj.getListByIds(data.items.map((i) => i.productId));
    // data.items.forEach(
    //   (item) => productObj.edit(batch, item.productId, { qty: increment(-item.qty) }, createdBy), //decreasing qty
    // );
    data.items.forEach((item) => {
      const currProduct = products.find((p) => p.id === item.productId)!;
      productObj.edit(
        batch,
        item.productId,
        {
          qty: increment(-item.qty),
          sales: increment(item.qty),
          score: productService.calculateVisibilityScore({
            qty: currProduct.qty - item.qty,
            addToCart: currProduct.addToCart,
            sales: currProduct.sales,
            wishlist: currProduct.wishlist,
            reviewRating: currProduct.reviewRating,
            reviewCount: currProduct.reviewCount,
            createdAt: currProduct.createdAt as Date,
          }),
        },
        createdBy,
      );
    });
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
    const productService = new ProductService(this.db);
    const productObj = new Product(this.db);
    const products = await productObj.getListByIds(Object.keys(mutatedProductsQty));
    Object.entries(mutatedProductsQty).forEach(([productId, qtyDiff]) => {
      const currProduct = products.find((p) => p.id === productId)!;
      productObj.edit(
        batch,
        productId,
        {
          qty: increment(-qtyDiff),
          sales: increment(qtyDiff),
          score: productService.calculateVisibilityScore({
            qty: currProduct.qty - qtyDiff,
            addToCart: currProduct.addToCart,
            sales: (currProduct.qty || 0) + qtyDiff,
            wishlist: currProduct.wishlist,
            reviewRating: currProduct.reviewRating,
            reviewCount: currProduct.reviewCount,
            createdAt: currProduct.createdAt as Date,
          }),
        },
        updatedBy,
      );
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
