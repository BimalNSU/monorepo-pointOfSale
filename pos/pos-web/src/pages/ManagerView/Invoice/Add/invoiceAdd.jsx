import { useState } from "react";
import { Input, Row, Col, Form, Typography, Card, Spin, Modal, Divider, InputNumber } from "antd";
import * as validator from "@/utils/Validation/Validation";
import InvoiceItemTable from "./invoice-item-table";
import { useFirestore } from "reactfire";
import InvoiceService from "@/service/invoice.service";
import { useDocumentFormat } from "@/api/useDocumentFormat";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
import { error, success } from "@/utils/Utils/Utils";
import PrintReceipt from "@/components/ReceiptPrint/printReceipt";
import useAuthStore from "@/stores/auth.store";
import ProductSearchBox from "@/components/Product/productSearchBox";
import { convertToBD } from "@/constants/currency";
import PaymentCard from "./paymentCard";
const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const InvoiceAdd = () => {
  const db = useFirestore();
  const [newInvoice, setNewInvoice] = useState();
  const invoiceService = new InvoiceService(db);
  const { userId } = useAuthStore();
  const { status: invoiceCounterStatus, documentId: newInvoiceId } = useDocumentFormat(
    DOCUMENT_FORMAT.VALUES.Invoice,
  );

  const [invoiceItems, setInvoiceItems] = useState([]);
  const [salesForm] = Form.useForm();
  const [discountTotal, setDiscountTotal] = useState();

  const resetSalesForm = () => {
    setInvoiceItems([]);
    setDiscountTotal();
    salesForm.resetFields();
  };

  const onFinishInvoice = async (values) => {
    confirm({
      title: "Are you sure to generate a new invoice?",
      async onOk() {
        const { items, ...rest } = values;
        const formattedItems = invoiceItems.map((item) => {
          const itemInForm = values.items[item.productId];
          return {
            productId: item.productId,
            name: item.name,
            qty: itemInForm.qty,
            rate: item.rate,
            discount: itemInForm.discount ?? null,
          };
        });
        try {
          const nInvoice = await invoiceService.create(
            { ...rest, id: newInvoiceId, discount: discountTotal, items: formattedItems },
            userId,
          );

          resetSalesForm();
          success("New invoice is created successfully");

          setNewInvoice(nInvoice); //temporary store data for print
        } catch (err) {
          error("Fail to create an invoice");
        }
      },
    });
  };

  const handleDelete = (key) => {
    setInvoiceItems((prev) => prev.filter((item) => item.key !== key));
  };

  // Update the row data when a field changes
  const handleTableRowChange = (value, field, key) => {
    const updatedItems = invoiceItems.map((row) =>
      row.key === key ? { ...row, [field]: value } : row,
    );
    setInvoiceItems(updatedItems);

    //update total discount
    if (field === "discount") {
      const nDiscountTotal = updatedItems.reduce((pre, curr) => pre + (curr.discount ?? 0), 0);
      setDiscountTotal(nDiscountTotal);
    }
  };
  const handleSelectMatchedItem = (product) => {
    let isItemInTable = false;
    //update qty of existing item in table
    const updatedItems = invoiceItems.map((row) => {
      if (row.key === product.id) {
        isItemInTable = true;
        return { ...row, qty: row.qty + 1 };
      } else {
        return row;
      }
    });
    if (isItemInTable) {
      setInvoiceItems(updatedItems);
    }
    //add new item in table
    else {
      setInvoiceItems((prev) => [
        ...prev,
        {
          // key: String(prev.length + 1),
          key: product.id,
          productId: product.id,
          name: product.name,
          description: product.description,
          qty: 1,
          rate: product.salesRate,
        },
      ]);
    }
  };

  // const handleAfterPrint = () => {
  //   setNewInvoice();
  // };
  // const demoPrint = async () => {
  //   const nInvoice = await invoiceService.get("20241225002");
  //   setNewInvoice(nInvoice); //temporary store data for printing
  // };
  return (
    <div>
      {/* <Button onClick={demoPrint}>Demo print</Button>
      {newInvoice ? (
        <PrintReceipt directPrint={true} onAfterPrint={handleAfterPrint} invoice={newInvoice} />
      ) : null} */}
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
      <Form form={salesForm} onFinish={onFinishInvoice}>
        <Row style={{ background: "#ecf0f1" }} gutter={[16, 1]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <ProductSearchBox onSelectMatchedItem={handleSelectMatchedItem} />
            {/* <Button type="dashed" onClick={handleAdd} style={{ marginTop: 16 }} icon={<PlusOutlined />}>
        Add Row
      </Button> */}
          </Col>
          <Col xs={24} sm={24} md={8} lg={16} xl={16}>
            <InvoiceItemTable
              salesForm={salesForm}
              dataSource={invoiceItems}
              onChangeRow={handleTableRowChange}
              onDeleteRow={handleDelete}
            />
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Card
              title="Summary"
              style={{ marginBottom: 16 }}
              styles={{
                header: { padding: "6px 12px", fontSize: 14 },
                body: { padding: "10px 12px" },
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  rowGap: 16,
                  padding: "0 16px", // Added inner padding
                }}
              >
                <Text strong>Total Bill:</Text>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <Text style={{ textAlign: "right", minWidth: 60 }}>
                    {convertToBD(
                      invoiceItems.reduce(
                        (pre, curr) => pre + (curr.qty ?? 0) * (curr.rate ?? 0),
                        0,
                      ),
                    )}
                  </Text>
                  <Text style={{ paddingLeft: "4px", width: 30, textAlign: "left" }}>TK.</Text>
                </div>
                {/* Total Discount - Display Only */}
                <Text strong>Total Discount:</Text>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <Text style={{ textAlign: "right", minWidth: 60 }}> {discountTotal ?? 0}</Text>
                  <Text style={{ paddingLeft: "4px", width: 30, textAlign: "left" }}>TK.</Text>
                </div>
                <Text strong>Special Discount:</Text>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Item name="specialDiscount" style={{ margin: 0 }}>
                    <InputNumber
                      disabled={!invoiceItems || !invoiceItems?.length}
                      min={0}
                      controls={false}
                      style={{
                        width: "100%",
                        textAlign: "right",
                        maxWidth: 150,
                      }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    />
                  </Form.Item>
                  <Text style={{ width: 30, textAlign: "left", paddingLeft: 4 }}>TK.</Text>
                </div>
                <Divider style={{ gridColumn: "1 / -1", margin: "12px 0" }} /> {/* Total */}
                <Title level={4} style={{ margin: 0 }}>
                  Total:
                </Title>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "baseline",
                  }}
                >
                  <Form.Item noStyle dependencies={["specialDiscount"]}>
                    {() => {
                      const specialDiscount = salesForm.getFieldValue("specialDiscount");
                      const total = invoiceItems.reduce(
                        (pre, curr) =>
                          pre + (curr.qty ?? 0) * (curr.rate ?? 0) - (curr.discount ?? 0),
                        specialDiscount ? -specialDiscount : 0,
                      );
                      return (
                        <Title level={4} style={{ margin: 0, minWidth: 60, textAlign: "right" }}>
                          <span>{convertToBD(total)}</span>
                        </Title>
                      );
                    }}
                  </Form.Item>

                  <Text style={{ paddingLeft: "2px", width: 30, textAlign: "left" }}>TK.</Text>
                </div>
              </div>
            </Card>
            <PaymentCard
              form={salesForm}
              formName="payments"
              onReset={resetSalesForm}
              invoiceItems={invoiceItems}
            />
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ whitespace: true, message: validator.BLANK_SPACE_MESSAGE }]}
            >
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default InvoiceAdd;
