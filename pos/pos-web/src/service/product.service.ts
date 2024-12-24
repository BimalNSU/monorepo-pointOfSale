import { Product as ProductModel } from "@/models/product.model";
import { ProductId, UserId, WithId } from "@/models/common.model";
import { Firestore, writeBatch } from "firebase/firestore";
import { Product } from "@/db-collections/product.collection";
import { DocumentCounter } from "@/db-collections/documentCounter.collection";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
type omitKeys =
  | "qty"
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";

type Data = WithId<Omit<ProductModel, omitKeys> & { qty?: number }>;

class ProductService {
  db: Firestore;
  constructor(db: Firestore) {
    this.db = db;
  }
  async create(data: Data, createdBy: UserId) {
    const productObj = new Product(this.db);
    try {
      const batch = writeBatch(this.db);
      productObj.add(
        batch,
        {
          // category: {},
          id: data.id,
          name: data.name,
          description: data.description ?? null,
          qty: data.qty ?? 0,
          purchaseRate: data.purchaseRate ?? null,
          salesRate: data.salesRate,
          imagesFiles: null,
        },
        createdBy,
      );
      new DocumentCounter(this.db).incrementCounter(batch, DOCUMENT_FORMAT.VALUES.Product);
      await batch.commit();
      return data.id;
    } catch (err) {
      console.log(err);
      throw new Error("Failed to create");
    }
  }
  async edit(id: ProductId, data: Partial<Data>, updatedBy: UserId) {
    try {
      const batch = writeBatch(this.db);
      const productObj = new Product(this.db);
      productObj.edit(
        batch,
        id,
        {
          name: data.name,
          description: data.description ?? null,
          qty: data.qty ?? 0,
          purchaseRate: data.purchaseRate ?? null,
          salesRate: data.salesRate,
        },
        updatedBy,
      );
      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  }
  async delete(id: ProductId, updatedBy: UserId) {
    try {
      const batch = writeBatch(this.db);
      const productObj = new Product(this.db);
      productObj.remove(batch, id, updatedBy);
      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  }
}
export default ProductService;
