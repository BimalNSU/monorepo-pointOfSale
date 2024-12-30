import React, { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { convertToBD } from "@/constants/currency";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import styles from "./receiptPrint.module.css";

const PrintReceipt = ({ invoice, directPrint, onAfterPrint }) => {
  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
    pageStyle: `
      @page {
        size: 58mm auto; /* Adjust to match your thermal printer width (58mm or 80mm) */
        margin: 0;
      }
      body {
        margin: 0;
      }
    `,
    documentTitle: invoice.id,
    onAfterPrint: () => {
      onAfterPrint();
    },
  });

  // Automatically trigger printing if directPrint is true
  useEffect(() => {
    if (directPrint) {
      handlePrint();
    }
  }, [directPrint]);

  return (
    <div>
      {!directPrint ? (
        <Button type="text" size="large" onClick={handlePrint} icon={<PrinterOutlined />} />
      ) : null}
      <div ref={contentRef} className={styles.receipt}>
        <div className={styles.receiptHeader}>
          <h2>Organic Design</h2>
          <p style={{ marginTop: "3px", fontSize: "10px" }}>
            উত্তরা ময়লার মোড়, সোনারগাঁও জনপদ রোড, ট্রাফিক পুলিশ বক্সের সাথে,সেক্টর -১৩, উত্তরা,
            ঢাকা-১২৩০
          </p>
        </div>
        <div className={styles.receiptInfo}>
          <p>
            <strong>Invoice# </strong> {invoice.id}
          </p>
          <p>
            <strong>Date:</strong> {dayjs(invoice.createdAt).format(DATE_TIME_FORMAT)}
          </p>
        </div>
        <hr />
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{convertToBD(item.qty * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.totals}>
          {invoice.discount ? (
            <div>
              <p>
                <strong>Subtotal:</strong>{" "}
                {convertToBD(invoice.items.reduce((pre, curr) => pre + curr.qty * curr.rate, 0))}
              </p>
              <p>
                <strong>Discount:</strong> {convertToBD(invoice.discount)}
              </p>
            </div>
          ) : null}
          <p>
            <strong>Total:</strong> {convertToBD(invoice.totalAmount)}
          </p>
        </div>
        <hr />
        <div className={styles.note}>
          <p style={{ fontSize: "10px" }}>Thank you for your purchase!</p>
        </div>
      </div>
    </div>
  );
};

export default PrintReceipt;
