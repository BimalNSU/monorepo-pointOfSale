import { useRef, useState } from "react";
import { Modal, Button, InputNumber } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import BarcodeLabel from "@/components/barcodeLabel/barcodeLabel";
import { Product, WithId } from "@pos/shared-models";

type Props = {
  product: WithId<Product>;
  reset: () => void;
};

const PrintBarcodeLabel: React.FC<Props> = ({ product, reset }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [count, setCount] = useState(1);

  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Build the HTML for printing
    const html = `
    <html>
      <head>
        <style>
          @page {
            size: 50mm 30mm;
            margin: 0;
          }
          body {
            margin: 0;
           
          }
          .label {
            width: 50mm;
            height: 30mm;
            padding: 2mm;
            box-sizing: border-box;
            text-align: center;       /* centers text (product name, code, price) */

            display: flex;            /* centers all children including SVG */
            flex-direction: column;
            justify-content: center;
            align-items: center;
            page-break-after: always;
          }
        </style>
      </head>
      <body>
        ${Array.from({ length: count })
          .map(
            () => `<div class="label">${document.getElementById("barcode-html")!.innerHTML}</div>`,
          )
          .join("")}
      </body>
    </html>
  `;

    // Set the iframe content
    iframe.srcdoc = html;

    // Wait for iframe to load before printing
    iframe.onload = () => {
      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();
    };
  };

  return (
    <Modal title="Print Barcode Label" open={Boolean(product)} onCancel={reset} footer={null}>
      {/* PREVIEW */}
      <div id="barcode-html">
        <BarcodeLabel product={product} />
      </div>

      {/* CONTROLS */}
      <InputNumber
        min={1}
        max={200}
        value={count}
        onChange={(v) => setCount(v ?? 1)}
        style={{ width: "100%", marginTop: 16 }}
      />

      <Button
        type="primary"
        icon={<PrinterOutlined />}
        block
        onClick={handlePrint}
        style={{ marginTop: 16 }}
      >
        Print
      </Button>

      {/* HIDDEN IFRAME */}
      <iframe ref={iframeRef} style={{ display: "none" }} title="print" />
    </Modal>
  );
};

export default PrintBarcodeLabel;
