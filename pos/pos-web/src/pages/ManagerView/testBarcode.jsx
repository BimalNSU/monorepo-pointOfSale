import { PrinterOutlined } from "@ant-design/icons";
import { Button } from "antd";
import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "./barcode.module.css";

const Barcode = ({ name, value, width = 2, height = 50, displayValue = true }) => {
  const barcodeRef = useRef(null);
  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        format: "CODE128",
        width,
        height,
        displayValue,
      });
    }
  }, [value, width, height, displayValue]);
  return (
    <>
      <p style={{ margin: 0 }}>Test product {name}</p>
      <svg ref={barcodeRef} />
    </>
  );
};
const TestBarcode = () => {
  const productCodes = [
    "001",
    "002",
    "003",
    "004",
    "005",
    "006",
    "007",
    "008",
    "009",
    "010",
    "011",
    "012",
    "013",
    "014",
    "015",
    "016",
    "1001",
    "1002",
    "1003",
    "1004",
    "1005",
    "1006",
    "12345",
  ]; // List of product codes

  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "barcodes",
    // onAfterPrint: () => {
    //   //
    // },
  });
  return (
    <div>
      <Button type="text" size="large" onClick={handlePrint} icon={<PrinterOutlined />} />
      <h1>Product Barcodes</h1>
      <div
        ref={contentRef}
        className={styles.barcode}
        style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
      >
        {productCodes.map((code, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <Barcode name={index + 1} value={code} width={2} height={100} displayValue={true} />
            {/* <p>{`Product Code: ${code}`}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};
export default TestBarcode;
