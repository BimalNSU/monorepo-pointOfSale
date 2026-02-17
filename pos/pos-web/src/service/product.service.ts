import {
  Product as ProductModel,
  ProductId,
  ShopId,
  UserId,
  WithId,
  ProductImageType,
} from "@pos/shared-models";
import { Firestore, writeBatch } from "firebase/firestore";
import { Product } from "@/db-collections/product.collection";
import { DocumentCounter } from "@/db-collections/documentCounter.collection";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
import CustomAuthService from "./customAuth.service";
import { ShopRole, UserRole } from "@pos/shared-models";
import { deleteObject, StorageReference } from "firebase/storage";
type omitKeys =
  | "qty"
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";

type AddData = WithId<Omit<ProductModel, omitKeys> & { qty: number }>;
type UpdateData = WithId<Partial<Omit<ProductModel, omitKeys>> & { qty: number }>;
type PartialAuthData = { userId: UserId; role: UserRole; shopId?: ShopId; shopRole: ShopRole };
type DeletedMedia = Omit<ProductImageType, "createdAt">;
interface ProductScore
  extends Pick<
    ProductModel,
    "qty" | "addToCart" | "sales" | "wishlist" | "reviewRating" | "reviewCount"
  > {
  createdAt?: Date;
}

class ProductService {
  db: Firestore;
  constructor(db: Firestore) {
    this.db = db;
  }
  async create(data: AddData, partialAuth: PartialAuthData) {
    const authService = new CustomAuthService(this.db);
    const isAuthValid = await authService.validate(partialAuth);
    if (!isAuthValid) {
      throw new Error(`Auth session is corrupted`);
    }
    const productObj = new Product(this.db);
    try {
      const batch = writeBatch(this.db);
      productObj.add(
        batch,
        {
          id: data.id,
          name: data.name,
          description: data.description ?? null,
          qty: data.qty || 0,
          unit: data.unit,
          purchaseRate: data.purchaseRate || null,
          salesRate: data.salesRate,
          barcode: data.barcode || null,
          media: { images: data.media.images, videos: [] },

          //new
          discount: data.discount || null,
          categoryId: data.categoryId || null,
          brand: data.brand || null,
          tags: data.tags || null,

          //default
          addToCart: 0,
          sales: 0,
          wishlist: 0,
          reviewRating: 0,
          reviewCount: 0,
          score: this.calculateVisibilityScore({
            qty: data.qty || 0,
            addToCart: 0,
            sales: 0,
            wishlist: 0,
            reviewRating: 0,
            reviewCount: 0,
          }),
        },
        partialAuth.userId,
      );
      new DocumentCounter(this.db).incrementCounter(batch, DOCUMENT_FORMAT.VALUES.Product);
      await batch.commit();
      return data.id;
    } catch (err) {
      console.log(err);
      throw new Error("Failed to create");
    }
  }
  async edit(id: ProductId, data: UpdateData, updatedBy: UserId) {
    try {
      const batch = writeBatch(this.db);
      const productObj = new Product(this.db);
      const product = await productObj.get(id);
      productObj.edit(
        batch,
        id,
        {
          name: data.name,
          description: data.description ?? null,
          qty: data.qty || 0,
          purchaseRate: data.purchaseRate ?? null,
          salesRate: data.salesRate,
          barcode: data.barcode || null,
          unit: data.unit,
          ...(data.qty !== product.qty && {
            score: this.calculateVisibilityScore({
              qty: data.qty || 0,
              addToCart: product.addToCart,
              sales: product.sales,
              wishlist: product.wishlist,
              reviewRating: product.reviewRating,
              reviewCount: product.reviewCount,
              createdAt: product.createdAt as Date, //TODO: test it
            }),
          }),
        },
        updatedBy,
      );
      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  }
  async editMedia(
    id: ProductId,
    targetImage: ProductImageType,
    dbImages: ProductImageType[],
    updatedBy: UserId,
  ) {
    try {
      const productObj = new Product(this.db);
      const editedMedia = [...dbImages];
      const indexMatched = editedMedia.findIndex((dbImage) => dbImage.path === targetImage.path);
      if (indexMatched > -1) {
        editedMedia[indexMatched] = targetImage;
      } else {
        editedMedia.push(targetImage);
      }
      const batch = writeBatch(this.db);
      productObj.edit(
        batch,
        id,
        {
          media: { images: editedMedia },
        },
        updatedBy,
      );
      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  }
  async deleteMedia(
    id: ProductId,
    imageRef: StorageReference,
    deletedMedia: DeletedMedia,
    dbImages: ProductImageType[],
    updatedBy: UserId,
  ) {
    try {
      const batch = writeBatch(this.db);
      const productObj = new Product(this.db);
      await deleteObject(imageRef); //remove image from firebase-storage

      const mutatedImages = dbImages.reduce((pre, curr) => {
        if (curr.path !== deletedMedia.path) {
          pre.push({ ...curr });
        }
        return pre;
      }, new Array<ProductImageType>());
      if (deletedMedia.isPrimary && mutatedImages.length > 0) {
        mutatedImages[0].isPrimary = true;
      }
      productObj.edit(batch, id, { media: { images: mutatedImages } }, updatedBy);
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
  calculateVisibilityScore(product: ProductScore) {
    // Out of stock
    if (!product.qty || product.qty <= 0) {
      return 0;
    }

    const logScale = (value?: number | null) => Math.log(1 + (value || 0));

    // --- Engagement Metrics (No max needed) ---
    const cartScore = logScale(product.addToCart);
    const salesScore = logScale(product.sales as number);
    const wishlistScore = logScale(product.wishlist);

    const ratingScore = (product.reviewRating || 0) / 5;
    const reviewConfidence = logScale(product.reviewCount);

    const reviewScore = ratingScore * reviewConfidence;

    // --- Apply Diminishing Returns ---
    const saturate = (value: number) => value / (1 + value);

    const Cn = saturate(cartScore);
    const Sn = saturate(salesScore);
    const Wn = saturate(wishlistScore);
    const Rn = saturate(reviewScore);

    // --- Weights (POS optimized) ---
    const weightCart = 0.15;
    const weightSales = 0.45;
    const weightReview = 0.2;
    const weightWishlist = 0.1;

    let score = Cn * weightCart + Sn * weightSales + Rn * weightReview + Wn * weightWishlist;

    // --- New Product Boost (Smooth decay) ---
    const now = Date.now();
    // const createdAt = product.createdAt?.toMillis ? product.createdAt.toMillis() : now;
    const createdAt = product.createdAt instanceof Date ? product.createdAt.getTime() : now;

    const daysSinceLaunch = (now - createdAt) / (1000 * 60 * 60 * 24);

    const newBoost = Math.exp(-daysSinceLaunch / 30) * 0.3;

    score += newBoost;

    // --- Stock Multiplier ---
    const stockScore = saturate(logScale(product.qty));
    const stockMultiplier = 0.6 + stockScore * 0.4;

    score *= stockMultiplier;

    // --- Final Clamp (0–10) ---
    const visibilityScore = Math.min(Math.max(score * 10, 0), 10);
    return visibilityScore;
    // return Number(visibilityScore.toFixed(2));
  }

  /**
   * Calculate product visibility score (0-10)
   * @param {Object} product - Product metrics
   * @param {number} product.addToCart - Number of times added to cart
   * @param {number} product.sales - Number of sales
   * @param {number} product.wishlist - Number of times added to wishlist
   * @param {number} product.reviewRating - Average review rating (1-5)
   * @param {number} [product.reviewCount] - Number of reviews (optional)
   * @param {Date} product.createdAt - Product creation date
   * @param {Object} maxValues - Max expected values for normalization
   * @param {number} maxValues.addToCart
   * @param {number} maxValues.sales
   * @param {number} maxValues.wishlist
   * @param {number} maxValues.reviewCount
   * @returns {number} Visibility score between 0-10
   */
  // calculateVisibilityScore(product: any, maxValues: any) {
  //   // Log-normalized values to reduce impact of outliers
  //   const Cn = Math.log(1 + (product.addToCart || 0)) / Math.log(1 + maxValues.addToCart);
  //   const Sn = Math.log(1 + (product.sales || 0)) / Math.log(1 + maxValues.sales);
  //   const Wn = Math.log(1 + (product.wishlist || 0)) / Math.log(1 + maxValues.wishlist);

  //   const Rc = product.reviewCount || 1; // avoid divide by zero
  //   const Rn =
  //     (((product.reviewRating || 0) / 5) * Math.log(1 + Rc)) / Math.log(1 + maxValues.reviewCount);

  //   // Assign weights (customizable)
  //   const weightCart = 0.25;
  //   const weightSales = 0.35;
  //   const weightReview = 0.25;
  //   const weightWishlist = 0.15;

  //   // Combine normalized metrics
  //   let scoreNormalized =
  //     Cn * weightCart + Sn * weightSales + Rn * weightReview + Wn * weightWishlist;

  //   // ---- New Product Bonus ----
  //   const now = Date.now();
  //   const createdAt = product.createdAt instanceof Date ? product.createdAt.getTime() : now;
  //   const daysSinceLaunch = (now - createdAt) / (1000 * 60 * 60 * 24);

  //   let newProductBonus = 0;
  //   if (daysSinceLaunch <= 7) newProductBonus = 0.5; // first week boost
  //   else if (daysSinceLaunch <= 30) newProductBonus = 0.25; // first month smaller boost

  //   scoreNormalized = Math.min(scoreNormalized + newProductBonus, 1); // clamp max to 1

  //   // Scale to 0-10 and clamp
  //   const visibilityScore = Math.min(Math.max(scoreNormalized * 10, 0), 10);

  //   return parseFloat(visibilityScore.toFixed(2)); // round to 2 decimals
  // }

  // --- Example ---
  product = {
    addToCart: 5,
    sales: 2,
    wishlist: 3,
    reviewRating: 4.2,
    reviewCount: 5,
    createdAt: new Date(), // new product
  };

  // console.log(calculateVisibilityScore(product, maxValues));
  // Output: e.g., 7.5 (boosted because it's new)
}
export default ProductService;
