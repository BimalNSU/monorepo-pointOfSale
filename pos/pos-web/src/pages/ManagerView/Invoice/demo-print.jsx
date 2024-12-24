import React, { useRef } from "react";
import ReactToPrint from "react-to-print";

// Receipt Component
const Receipt = React.forwardRef((_, ref) => (
  <div ref={ref} className="receipt">
    <h2>Organic Design</h2>
    <p>Address Line 1</p>
    <p>Phone: (123) 456-7890</p>
    <hr />
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Item A</td>
          <td>2</td>
          <td>$10.00</td>
        </tr>
        <tr>
          <td>Item B</td>
          <td>1</td>
          <td>$5.00</td>
        </tr>
      </tbody>
    </table>
    <hr />
    <p>
      <b>Total: $25.00</b>
    </p>
    <p>Thank you for your purchase!</p>
  </div>
));

const DemoPrint = () => {
  const receiptRef = useRef();

  return (
    <div style={{ padding: 20 }}>
      <ReactToPrint
        trigger={() => <button>Print Receipt</button>}
        content={() => receiptRef.current}
        pageStyle={`
          @page {
            size: 58mm auto;
            margin: 0;
          }
          .receipt {
            font-family: monospace;
            font-size: 12px;
            width: 58mm;
            padding: 10px;
          }
          .receipt h2 {
            text-align: center;
            margin: 5px 0;
          }
          .receipt table {
            width: 100%;
            border-collapse: collapse;
          }
          .receipt th, .receipt td {
            text-align: left;
            padding: 5px;
          }
          .receipt hr {
            border: none;
            border-top: 1px dashed #000;
          }
        `}
      />
      <Receipt ref={receiptRef} />
    </div>
  );
};

export default DemoPrint;
