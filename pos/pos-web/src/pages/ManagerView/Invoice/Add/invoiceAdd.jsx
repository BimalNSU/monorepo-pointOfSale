import { useState } from "react";
import {
  Input,
  Button,
  Row,
  Col,
  Form,
  Typography,
  AutoComplete,
  Card,
  Space,
  Spin,
  Modal,
} from "antd";
import * as validator from "@/utils/Validation/Validation";
import InvoiceItemTable from "./invoice-item-table";
import { useProducts } from "@/api/useProducts";
import InvoiceTotalDiscount from "./invoice-totalDiscount";
import { useFirestore } from "reactfire";
import InvoiceService from "@/service/invoice.service";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import { useDocumentFormat } from "@/api/useDocumentFormat";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
import { error, success } from "@/utils/Utils/Utils";
const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const InvoiceAdd = () => {
  const db = useFirestore();
  const invoiceService = new InvoiceService(db);
  const { userId } = useCustomAuth();
  const { status, data: products } = useProducts();
  const { status: fetchDocumentCounter, documentId: newInvoiceId } = useDocumentFormat(
    DOCUMENT_FORMAT.VALUES.Invoice,
  );
  const [searchItem, setSearchItem] = useState();
  const [matchedItems, setMatchedItems] = useState();
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
          await invoiceService.create(
            { ...rest, id: newInvoiceId, discount: totalDiscount, items: invoiceItems },
            userId,
          );

          //reset
          setDataSource([]);
          setTotalDiscount();
          salesForm.resetFields();
          success("New invoice is created successfully");
        } catch (err) {
          error("Fail to create new invoice");
        }
      },
    });
  };

  const handleDelete = (key) => {
    setDataSource((prev) => prev.filter((item) => item.key !== key));
    salesForm.resetFields([["items", key]]); //update only qty in form state
  };

  const handleAddItem = (itemId) => {
    if (!matchedItems?.length) return;

    const selectedItem = matchedItems.find((p) => p.id === itemId);
    let isItemInTable = false;

    //update old item qty in table
    const nDataSource = dataSource.map((row) => {
      if (row.key === itemId) {
        isItemInTable = true;
        salesForm.setFieldValue(["items", itemId, "qty"], row.qty + 1); //update only qty in form state
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
          key: itemId,
          productId: itemId,
          name: selectedItem.name,
          description: selectedItem.description,
          qty: 1,
          rate: selectedItem.salesRate,
        },
      ]);
    }

    //reset search item & it's result
    setSearchItem();
    setMatchedItems();
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

  const handleSearchItem = (text) => {
    if (text) {
      const pattern = new RegExp(`(${text})`, "i");
      const nMatchedProducts = products.filter((p) => pattern.test(p.id) || pattern.test(p.name));
      setMatchedItems(nMatchedProducts);
    } else {
      setMatchedItems();
    }
  };
  const handleOnPressEnter = (value) => {
    if (value && matchedItems?.length) {
      const autoSelectedItem =
        matchedItems.length === 1 ? matchedItems[0] : matchedItems.find((mp) => mp.id === value);
      if (autoSelectedItem) {
        handleAddItem(autoSelectedItem.id);
      }
    }
  };

  //reset each individual discount in table
  const onResetTableDiscount = () => {
    setIsRequiredTooltip(true);
    //reset each individuals' discount's fields in table & form states
    const nDataSource = dataSource.map((row) => {
      const { discount, ...rest } = row;
      salesForm.setFieldValue(["items", row.key, "discount"], undefined); //reset each individuals' discount's fields
      return rest;
    });
    setDataSource(nDataSource);
  };

  return (
    <div>
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
            <AutoComplete
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleOnPressEnter(searchItem);
                }
              }}
              value={searchItem}
              onChange={(value) => setSearchItem(value)}
              loading={status === "loading"}
              options={matchedItems?.map((p) => ({ label: p.name, value: p.id })) || []}
              style={{
                width: "25%",
              }}
              onSelect={handleAddItem}
              onSearch={handleSearchItem}
              placeholder="Start typing Item Name or scan Barcode.."
            />
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
                  Total:{" "}
                  {dataSource.reduce((pre, curr) => pre + (curr.qty ?? 0) * (curr.rate ?? 0), 0)}
                </Text>
                <InvoiceTotalDiscount
                  totalDiscount={totalDiscount}
                  setTotalDiscount={setTotalDiscount}
                  onPromptYes={onResetTableDiscount}
                  isRequiredTooltip={isRequiredTooltip}
                />
                <Text>
                  Net Total:{" "}
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
