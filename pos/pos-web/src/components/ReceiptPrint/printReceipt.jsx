import { convertToBD } from "@/constants/currency";
import { DATE_FORMAT } from "@/constants/dateFormat";
import { Button } from "antd";
import dayjs from "dayjs";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import styles from "./receiptPrint.module.css";
import { PrinterOutlined } from "@ant-design/icons";

// Receipt Component
const Receipt = React.forwardRef((props, ref) => (
  <div ref={ref} className={styles.receipt}>
    <div className={styles.receiptHeader}>
      <h2>Organic Design</h2>
      <p style={{ marginTop: "3px", fontSize: "7px" }}>
        উত্তরা ময়লার মোড়, সোনারগাঁও জনপদ রোড, ট্রাফিক পুলিশ বক্সের সাথে,সেক্টর -১৩, উত্তরা,
        ঢাকা-১২৩০
      </p>
    </div>
    <div className={styles.receiptInfo}>
      <p>
        <strong>Invoice # </strong> {props.data.id}
      </p>
      <p>
        <strong>Date:</strong> {dayjs(props.data.created).format(DATE_FORMAT)}
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
        {props.data.items.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.qty}</td>
            <td>{convertToBD(item.qty * item.rate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className={styles.totals}>
      {props.data.discount ? (
        <div>
          <p>
            <strong>Subtotal:</strong>{" "}
            {convertToBD(props.data.items.reduce((pre, curr) => pre + curr.qty * curr.rate, 0))}
          </p>
          <p>
            <strong>Discount:</strong> {convertToBD(props.data.discount)}
          </p>
        </div>
      ) : null}
      <p>
        <strong>Total:</strong> {convertToBD(props.data.totalAmount)}
      </p>
    </div>
    <div className={styles.separator}></div>
    <div className={styles.note}>
      <p style={{ fontSize: "10px" }}>Thank you for your purchase!</p>
    </div>
  </div>
));

const PrintReceipt = ({ data }) => {
  const receiptRef = useRef();
  return (
    <>
      <ReactToPrint
        trigger={() => <Button type="text" size="large" icon={<PrinterOutlined />} />}
        content={() => receiptRef.current}
        pageStyle={`
          @page {
            size: 58mm auto; /* Adjust to match your thermal printer width (58mm or 80mm) */
            margin: 0;
          }
          body {
            margin: 0;
          }
        `}
      />
      <Receipt ref={receiptRef} data={data} />
    </>
  );
};

export default PrintReceipt;
