import React, { useEffect, useMemo, useState } from "react";
import { Input, Row, Col, Form, Typography, Card, Modal, Divider, InputNumber } from "antd";
import * as validator from "@/utils/Validation/Validation";
import InvoiceItemTable from "./subComponents/invoice-item-table";
import ProductSearchBox from "@/components/Product/productSearchBox";
import { convertToBD } from "@/constants/currency";
import PaymentCard from "./subComponents/paymentCard";
import {
  ChartOfAccountId,
  Invoice,
  InvoiceItem,
  Product,
  ProductId,
  WithId,
} from "@pos/shared-models";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;
interface FormProps {
  onSubmit: (data: Invoice) => Promise<void>;
  onReset?: () => void;
  initialInvoiceData?: WithId<
    Omit<Invoice, "payments"> & {
      payments: { accountId: ChartOfAccountId; name: string; amount: number }[];
    }
  >;
}
interface TableInvoiceItem extends Omit<InvoiceItem, "description" | "discount"> {
  discount?: number;
}

const InvoiceForm: React.FC<FormProps> = ({ onSubmit, onReset, initialInvoiceData }) => {
  const [invoiceItems, setInvoiceItems] = useState<TableInvoiceItem[]>(
    initialInvoiceData?.items.map((item) => {
      const { discount, ...rest } = item;
      return { ...rest, key: item.productId };
    }) || [],
  );
  const [salesForm] = Form.useForm();
  const specialDiscount =
    Form.useWatch("specialDiscount", salesForm) ?? initialInvoiceData?.specialDiscount ?? 0;

  useEffect(() => {
    if (!initialInvoiceData) return;

    salesForm.setFieldsValue({
      specialDiscount: initialInvoiceData.specialDiscount,
      payments: initialInvoiceData.payments.map((p) => ({
        accountId: p.accountId,
        amount: p.amount,
      })),
    });
  }, [initialInvoiceData]);

  const calculatedData = useMemo(() => {
    const updatedData = invoiceItems.reduce(
      (pre, curr) => {
        pre.discountTotal += curr.discount || 0;
        pre.invoiceTotal += curr.qty * curr.rate - (curr.discount || 0);
        return pre;
      },
      {
        discountTotal: 0,
        invoiceTotal: specialDiscount ? -specialDiscount : 0,
      },
    );
    return updatedData;
  }, [invoiceItems, specialDiscount]);

  const resetSalesForm = () => {
    salesForm.resetFields();
    setInvoiceItems([]);
    if (onReset) {
      onReset();
    }
  };

  const onFinishInvoice = async (values: any) => {
    confirm({
      title: `Are you sure to ${!initialInvoiceData?.id ? "generate a new" : "update"} invoice?`,
      async onOk() {
        const { items, ...rest } = values;
        const formattedItems = invoiceItems.map((item) => {
          return {
            productId: item.productId,
            name: item.name,
            qty: item.qty,
            rate: item.rate,
            discount: item.discount ?? null,
          };
        });
        await onSubmit({ ...rest, items: formattedItems });
        resetSalesForm();
      },
    });
  };

  const handleDelete = (productId: ProductId) => {
    setInvoiceItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Update the row data when a field changes
  const handleTableRowChange = (value: number, field: "qty" | "discount", productId: ProductId) => {
    const updatedItems = invoiceItems.map((row) =>
      row.productId === productId ? { ...row, [field]: value } : row,
    );
    setInvoiceItems(updatedItems);
  };
  const handleSelectMatchedItem = (
    product: Omit<WithId<Product>, "createdAt"> & { createdAt: string },
  ) => {
    let isItemInTable = false;
    //update qty of existing item in table
    const updatedItems = invoiceItems.map((row) => {
      if (row.productId === product.id) {
        isItemInTable = true;
        return { ...row, qty: row.qty + 1 };
      } else {
        return row;
      }
    });
    if (isItemInTable) {
      setInvoiceItems(updatedItems);
    } else {
      //add new item in table
      setInvoiceItems((prev) => [
        ...prev,
        {
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

  return (
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
            form={salesForm}
            invoiceItems={invoiceItems}
            onChangeRow={handleTableRowChange}
            onDeleteRow={handleDelete}
            isEditing={initialInvoiceData ? true : false}
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
                    invoiceItems.reduce((pre, curr) => pre + (curr.qty ?? 0) * (curr.rate ?? 0), 0),
                  )}
                </Text>
                <Text style={{ paddingLeft: "4px", width: 30, textAlign: "left" }}>TK.</Text>
              </div>
              <Text strong>Total Discount:</Text>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <Text style={{ textAlign: "right", minWidth: 60 }}>
                  {calculatedData.discountTotal ? convertToBD(calculatedData.discountTotal) : 0}
                </Text>
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
                <Title level={4} style={{ margin: 0, minWidth: 60, textAlign: "right" }}>
                  <span>
                    {calculatedData.invoiceTotal ? convertToBD(calculatedData.invoiceTotal) : null}
                  </span>
                </Title>
                <Text style={{ paddingLeft: "2px", width: 30, textAlign: "left" }}>TK.</Text>
              </div>
            </div>
          </Card>
          <PaymentCard
            form={salesForm}
            formName="payments"
            onPaymentReset={resetSalesForm}
            hasInvoiceItems={Boolean(invoiceItems.length)}
            invoiceTotal={calculatedData.invoiceTotal || 0}
            initialPaymentAccounts={initialInvoiceData?.payments}
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
  );
};

export default InvoiceForm;
