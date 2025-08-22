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
    onAfterPrint: () => onAfterPrint && onAfterPrint(),
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
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.productId}>
                <td className={styles.description}>
                  <div className={styles.productName}>{item.name}</div>
                  <div className={styles.equation}>
                    {`${item.qty} x ${convertToBD(item.rate)}${
                      item.discount ? ` - ${convertToBD(item.discount)}` : ""
                    } = `}
                  </div>
                </td>
                <td className={styles.amount}>
                  {convertToBD(item.qty * item.rate - (item.discount || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className={styles.summary}>
          <tbody>
            {invoice.specialDiscount ? (
              <React.Fragment key={"specialDiscount"}>
                <tr>
                  <td>Subtotal:</td>
                  <td>
                    {convertToBD(
                      invoice.items.reduce((pre, curr) => pre + curr.qty * curr.rate, 0),
                    )}
                  </td>
                </tr>
                {/* <tr>
                      <td>TAX (8.5%):</td>
                      <td>20.40</td>
                    </tr> */}
                {/* <tr>
                          <td colSpan="2">-----</td>
                        </tr> */}
                {/* <tr>
                      <td>TOTAL BEFORE DISC:</td>
                      <td>260.36</td>
                    </tr> */}
                <tr>
                  <td>Special Disc.:</td>
                  <td>-{invoice.specialDiscount}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <div className={styles.divider} />
                  </td>
                </tr>

                {/* <tr>
              <td>CASH:</td>
              <td>250.00</td>
            </tr>
            <tr>
              <td>CHANGE:</td>
              <td>9.64</td>
            </tr> */}
              </React.Fragment>
            ) : null}
            <tr>
              <td>Invoice Total:</td>
              <td>{convertToBD(invoice.totalAmount)}</td>
            </tr>
            <tr>
              <td colSpan={2}>
                <div className={styles.divider} />
              </td>
            </tr>
            <tr>
              <td>Payment Methods</td>
              <td></td>
            </tr>
            <tr>
              <td>Cash:</td>
              <td>{convertToBD(invoice.totalAmount)}</td>
            </tr>
            {/* <tr>
              <td>Bank:</td>
              <td>{convertToBD(100)}</td>
            </tr> */}
            <tr>
              <td></td>
              <td>
                <div className={styles.divider} />
              </td>
            </tr>
            <tr>
              <td>Total Payment:</td>
              <td>{invoice.totalAmount}</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div className={styles.note}>
          <p style={{ fontSize: "10px" }}>Thank you for your purchase!</p>
        </div>
      </div>
    </div>
  );
};

export default PrintReceipt;
