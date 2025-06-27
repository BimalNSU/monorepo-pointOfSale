import { useState } from "react";
import { Input, Button, Row, Col, Form, Typography, Card, Space, Spin, Modal } from "antd";
import * as validator from "@/utils/Validation/Validation";
import InvoiceItemTable from "./invoice-item-table";
import InvoiceTotalDiscount from "./invoice-totalDiscount";
import { useFirestore } from "reactfire";
import InvoiceService from "@/service/invoice.service";
import { useDocumentFormat } from "@/api/useDocumentFormat";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
import { error, success } from "@/utils/Utils/Utils";
import PrintReceipt from "@/components/ReceiptPrint/printReceipt";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import useAuthStore from "@/stores/auth.store";
import ProductSearchBox from "@/components/Product/productSearchBox";
const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const InvoiceAdd = () => {
  const db = useFirestore();
  const [newInvoice, setNewInvoice] = useState();
  const invoiceService = new InvoiceService(db);
  const { userId } = useAuthStore();
  const { status: fetchDocumentCounter, documentId: newInvoiceId } = useDocumentFormat(
    DOCUMENT_FORMAT.VALUES.Invoice,
  );
  const [dataSource, setDataSource] = useState([]);
  const [salesForm] = Form.useForm();
  const [totalDiscount, setTotalDiscount] = useState();
  const [isRequiredTooltip, setIsRequiredTooltip] = useState();

  const onFinishInvoice = async (values) => {
    confirm({
      title: "Are you sure to generate a new invoice?",
      async onOk() {
        const { items, ...rest } = values;
        const invoiceItems = dataSource.map((item) => {
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
            { ...rest, id: newInvoiceId, discount: totalDiscount, items: invoiceItems },
            userId,
          );

          //reset
          setDataSource([]);
          setTotalDiscount();
          salesForm.resetFields();
          success("New invoice is created successfully");

          setNewInvoice(nInvoice); //temporary store data for print
        } catch (err) {
          error("Fail to create an invoice");
        }
      },
    });
  };

  const handleDelete = (key) => {
    setDataSource((prev) => prev.filter((item) => item.key !== key));
  };

  // Update the row data when a field changes
  const handleTableRowChange = (value, field, key) => {
    const nDataSource = dataSource.map((row) =>
      row.key === key ? { ...row, [field]: value } : row,
    );
    setDataSource(nDataSource);

    //update total discount
    if (field === "discount") {
      const nTotalDiscount = nDataSource.reduce((pre, curr) => pre + (curr.discount ?? 0), 0);
      setTotalDiscount(nTotalDiscount);
      if (isRequiredTooltip) {
        setIsRequiredTooltip(false);
      }
    }
  };
  const handleSelectMatchedItem = (product) => {
    let isItemInTable = false;
    //update qty of existing item in table
    const nDataSource = dataSource.map((row) => {
      if (row.key === product.id) {
        isItemInTable = true;
        return { ...row, qty: row.qty + 1 };
      } else {
        return row;
      }
    });
    if (isItemInTable) {
      setDataSource(nDataSource);
    }
    //add new item in table
    else {
      setDataSource((prev) => [
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

  //reset each individual discount in table
  const onResetTableDiscount = () => {
    setIsRequiredTooltip(true);
    //reset each individuals' discount's fields in table
    const nDataSource = dataSource.map((row) => {
      const { discount, ...rest } = row;
      return rest;
    });
    setDataSource(nDataSource);
  };

  const handleAfterPrint = () => {
    setNewInvoice();
  };
  const demoPrint = async () => {
    const nInvoice = await invoiceService.get("20241225002");
    setNewInvoice(nInvoice); //temporary store data for printing
  };
  return (
    <div>
      <Button onClick={demoPrint}>Demo print</Button>
      {newInvoice ? (
        <PrintReceipt directPrint={true} onAfterPrint={handleAfterPrint} invoice={newInvoice} />
      ) : null}
      <Row justify="center">
        <Title level={4}>
          Sales{" "}
          {fetchDocumentCounter === "loading" ? (
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
              dataSource={dataSource}
              onChangeRow={handleTableRowChange}
              onDeleteRow={handleDelete}
            />
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Card title="Summary & Payment">
              <Space direction="vertical">
                <Text>
                  Subtotal:{" "}
                  {dataSource.reduce((pre, curr) => pre + (curr.qty ?? 0) * (curr.rate ?? 0), 0)}
                </Text>
                <InvoiceTotalDiscount
                  totalDiscount={totalDiscount}
                  setTotalDiscount={setTotalDiscount}
                  onPromptYes={onResetTableDiscount}
                  isRequiredTooltip={isRequiredTooltip}
                />
                <Text>
                  Total:{" "}
                  {dataSource.reduce(
                    (pre, curr) => pre + (curr.qty ?? 0) * (curr.rate ?? 0),
                    -(totalDiscount ?? 0),
                  )}
                </Text>
              </Space>
              <Row gutter={[16, 1]} justify="end">
                <Col>
                  {/* <Form.Item> */}
                  <Button
                    // style={{ background: "#27ae60" }}
                    type="primary"
                    htmlType="submit"
                    disabled={!dataSource || !dataSource?.length}
                  >
                    Save
                  </Button>
                  {/* </Form.Item> */}
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="note"
              label="Note"
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
