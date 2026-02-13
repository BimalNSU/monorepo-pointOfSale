import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Row,
  Col,
  Table,
  Space,
  Tag,
  InputNumber,
  Form,
  Popconfirm,
  Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import { INVOICE_STATUS, PMS_INVOICE_STATUS } from "@/constants/paymentStatus";
import BackBtn from "../../Button/BackBtn";
import { convertToBD } from "@/constants/currency";
import styles from "./table.module.css";
import { EditableCell } from "./editableCell";
import RegularInvoice from "@/service/invoice.service";
import { useFirestore } from "reactfire";
import PDFGenerator from "./PDFGenerator";

const { Title, Text } = Typography;

const InvoiceDetailsComponent = ({ invoiceData, authUserId, authRole }) => {
  const navigate = useNavigate();
  const db = useFirestore();
  const invoiceObj = new RegularInvoice(db);
  const [invoiceTableData, setInvoiceTableData] = useState([]);
  const [finalTotal, setFinalTotal] = useState(0);
  const [previousDue, setPreviousDue] = useState(0);

  useEffect(() => {
    const nPreviousDue = invoiceData.transferredTotalAmount - invoiceData.transferredTotalPaid || 0;
    setPreviousDue(nPreviousDue);
    setInvoiceTableData(invoiceData.bills.map((b, i) => ({ ...b, key: i + 1 } || [])));
    setFinalTotal(invoiceData.currentTotal + nPreviousDue - invoiceData.discountTotal);
  }, [invoiceData]);

  //edit invoice table
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      // name: "",
      // age: "",
      // address: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...invoiceTableData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const nData = {
          pBills: { pBillId: item.pBillId, pBillNameId: item.pBillNameId, amount: row.amount },
        };
        await invoiceObj.updateWithPbill(invoiceData.id, nData, authUserId);
        // newData.splice(index, 1, {
        //   ...item,
        //   ...row,
        // });
        // setInvoiceTableData(newData);
        setEditingKey("");
      } else {
        //add new row data in table
        // newData.push(row);
        // setInvoiceTableData(newData);
        // setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "name",
      align: "left",
    },
    {
      title: "Amount (BDT)",
      dataIndex: "amount",
      render: (text, record) => convertToBD(text),
      align: "right",
      editable: true,
    },
  ];
  if (authRole === "manager") {
    columns.push({
      title: "",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return !invoiceData.paymentIds.length && record.pBillId && record.pBillNameId ? (
          editable ? (
            <span>
              <Typography.Link
                onClick={() => save(record.key)}
                style={{
                  marginRight: 8,
                }}
              >
                Save
              </Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Typography.Link disabled={editingKey !== ""} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
          )
        ) : null;
      },
    });
  }

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "amount" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="addPadding-10">
      <div className={`border p-3 rounded`}>
        <Row style={{ width: "100%" }} justify={"space-between"}>
          <Col>
            <BackBtn
              onClick={() => {
                if (authRole === "owner" || authRole === "tenant") {
                  navigate("/invoices");
                } else {
                  navigate(-1); //go back
                }
              }}
            />
          </Col>
          <Col>
            <PDFGenerator
              invoiceData={invoiceData}
              previousDue={previousDue}
              finalTotal={finalTotal}
              invoiceTableData={invoiceTableData}
            />
          </Col>
        </Row>
        <Row style={{ width: "100%" }} align="center">
          <Title level={3}> Invoice of {invoiceData.month} </Title>
        </Row>
        <Row style={{ width: "100%" }} justify="space-between">
          <Col>
            <Row gutter={16}>
              <Col>
                <Space orientation="vertical">
                  <Text>
                    <b>Invoice No:</b>
                  </Text>
                  <Text>
                    <b>Bill To:</b>
                  </Text>
                  <Text>
                    <b>Month:</b>
                  </Text>
                  <Text>
                    <b>Issue Date:</b>
                  </Text>
                  <Text>
                    <b>Due Date:</b>
                  </Text>
                </Space>
              </Col>
              <Col>
                <Space orientation="vertical">
                  <Text> {invoiceData.id}</Text>
                  <Text>{`${invoiceData.targetUserName}`}</Text>
                  <Text> {invoiceData.month}</Text>
                  <Text>{invoiceData.createdAt}</Text>
                  <Text>{invoiceData.dueDate}</Text>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row gutter={16} justify="space-between">
              <Col>
                <Space orientation="vertical">
                  <Text>
                    <b>Previous Due Amount:</b>
                  </Text>
                  <Text>
                    <b>Discount:</b>
                  </Text>
                  <Text>
                    <b>Total Current charges:</b>
                  </Text>
                  <Text>
                    <b>Total Due Amount:</b>
                  </Text>
                  <Text>
                    <b>Status:</b>
                  </Text>
                </Space>
              </Col>
              <Col>
                <Space orientation="vertical">
                  <Text> {convertToBD(previousDue)}</Text>
                  <Text> {convertToBD(invoiceData.discountTotal)}</Text>
                  <Text> {convertToBD(invoiceData.currentTotal)}</Text>
                  <Text>{convertToBD(finalTotal)}</Text>
                  <Text>
                    {" "}
                    <Tag color={PMS_INVOICE_STATUS[invoiceData.paymentStatus].color}>
                      {" "}
                      {PMS_INVOICE_STATUS[invoiceData.paymentStatus].text}
                    </Tag>
                  </Text>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "100%" }} align="center">
          <Title level={3}> Invoice Summary </Title>
        </Row>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            rowClassName={styles["editable-row"]}
            dataSource={invoiceTableData}
            pagination={false}
            bordered
            summary={(pageData) => {
              //   // let totalAmount = 0;
              //   // pageData.forEach(({ amount }) => {
              //   //   totalAmount += amount;
              //   // });
              //   // totalAmount = Number(totalAmount.toFixed(2));
              //   // setCurTotal(totalAmount);
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    {/* <Text type="danger">{totalAmount}</Text> */}
                    <b>Total</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    {/* <Text>{totalAmount.toFixed(2)}</Text> */}
                    <Text>{convertToBD(invoiceData.currentTotal)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
          />
        </Form>
      </div>
    </div>
  );
};
export default InvoiceDetailsComponent;
