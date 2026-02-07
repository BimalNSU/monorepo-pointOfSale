import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import "./barcode-print.css";
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
      height: 32,
      displayValue: false,
      margin: 0,
    });
  }, [product.barcode]);

  return (
    <div className="print-label">
      <div className="print-product-name">{product.name}</div>
      <svg ref={ref} />
      <div className="print-product-code">{product.barcode ?? product.id}</div>
      <div className="print-price">{`Price ${product.salesRate} BDT`}</div>
      <div className="print-company">{`Organic Design`}</div>
    </div>
  );
};

export default BarcodeLabel;
