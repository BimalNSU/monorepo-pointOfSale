import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import styles from "./label.module.css";
import { Product, WithId } from "@pos/shared-models";

type Props = {
  product: WithId<Product>;
};

const BarcodeLabel: React.FC<Props> = ({ product }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    JsBarcode(ref.current, product.barcode ?? product.id, {
      format: "CODE128",
      width: 1.2,
      height: 40,
      displayValue: false,
      margin: 0,
    });
  }, [product.barcode]);

  return (
    <div className={styles.label}>
      <div className={styles.productName}>{product.name}</div>
      <svg ref={ref} />
      <div className={styles.productCode}>{product.barcode ?? product.id}</div>
      <div className={styles.price}>৳ {product.salesRate}</div>
    </div>
  );
};

export default BarcodeLabel;
