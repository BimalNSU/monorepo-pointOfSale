import { useState } from "react";
import { Row, Typography, Spin } from "antd";
import { useFirestore } from "reactfire";
import InvoiceService from "@/service/invoice.service";
import { useDocumentFormat } from "@/api/useDocumentFormat";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
import { error, success } from "@/utils/Utils/Utils";
import PrintReceipt from "@/components/ReceiptPrint/printReceipt";
import useAuthStore from "@/stores/auth.store";
import InvoiceForm from "@/components/Invoice/invoiceForm";
const { Title, Text } = Typography;

const InvoiceAdd = () => {
  const db = useFirestore();
  const [newInvoice, setNewInvoice] = useState();
  const invoiceService = new InvoiceService(db);
  const { userId } = useAuthStore();
  const { status: invoiceCounterStatus, documentId: newInvoiceId } = useDocumentFormat(
    DOCUMENT_FORMAT.VALUES.Invoice,
  );

  const handleSubmit = async (values) => {
    try {
      const nInvoice = await invoiceService.create(values, userId);
      setNewInvoice(nInvoice); //temporary store data for print
      success(`New invoice is created successfully`);
    } catch (err) {
      error("Fail to create an invoice");
    }
  };

  const handleAfterPrint = () => {
    setNewInvoice();
  };
  // const demoPrint = async () => {
  //   const nInvoice = await invoiceService.get("20241225002");
  //   setNewInvoice(nInvoice); //temporary store data for printing
  // };
  return (
    <div>
      {/* <Button onClick={demoPrint}>Demo print</Button>
       */}
      {newInvoice ? (
        <PrintReceipt directPrint={true} onAfterPrint={handleAfterPrint} invoice={newInvoice} />
      ) : null}
      <Row justify="center">
        <Title level={4}>
          Sales
          {invoiceCounterStatus === "loading" ? (
            <Spin size="small" />
          ) : (
            <span>(Invoice# {newInvoiceId})</span>
          )}
        </Title>
      </Row>

      <InvoiceForm onSubmit={handleSubmit} />
    </div>
  );
};

export default InvoiceAdd;
