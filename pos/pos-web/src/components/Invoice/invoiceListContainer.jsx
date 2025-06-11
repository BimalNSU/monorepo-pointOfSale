import { useState } from "react";
import { useFirestore } from "reactfire";

import { Button, Select, Row, Typography, Col, Table, Space, Modal, Tag, Card } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
// import { removeInvoice, removeInvoices } from "@/api/manager/invoiceFunctions";
import { INVOICE_STATUS } from "@/constants/paymentStatus";
import { convertToBD } from "@/constants/currency";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import InvoiceService from "@/service/invoice.service";
import { USER_ROLE } from "@/constants/role";

const { Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const InvoiceListContainer = ({ status, data: invoices }) => {
  const { userId, role } = useFirebaseAuth();
  const db = useFirestore();
  const invoiceService = new InvoiceService(db);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState();

  const handleBulkDeleteInvoices = (e, invoiceIds) => {
    e.preventDefault();
    confirm({
      title: "Are you sure to delete selected invoices?",
      async onOk() {
        await invoiceService.bulkDelete(invoiceIds, userId);
      },
    });
  };
  const renderValueCell = (text, record) => (
    <Link
      to={{ pathname: `/invoices/${record.id}` }}
      style={{
        color: "black",
        textDecoration: "none",
      }}
    >
      {record.isDeleted ? <Text type="danger">{text}</Text> : text}
    </Link>
  );
  const columns = [
    {
      dataIndex: "mobileIndex",
      key: "mobileIndex",
      render: (text, record) => (
        <div>
          <Link
            to={{ pathname: `/invoices/${record.id}` }}
            style={{
              color: "black",
              textDecoration: "none",
            }}
          >
            {record.isDeleted ? <Text type="danger">{text}</Text> : text}
            <Text strong>#:</Text> {record.id}
            <br />
            <Text strong>Date:</Text> {record.createdAt}
            <br />
            <Text strong>Discount:</Text>{" "}
            {record.discount ? convertToBD(record.discount) : record.discount}
            <br />
            <Text strong>Amount:</Text> {convertToBD(record.totalAmount)}
            <br />
            <Text strong>Status: </Text>
            <Tag color={INVOICE_STATUS.KEYS[record.status].color}>
              {INVOICE_STATUS.KEYS[record.status].text}
            </Tag>
            {/* <br />
            {(authRole === "manager" || authRole === "owner") && (
              <div>
                <Text strong>Bill To:</Text> {record.billTo}
              </div>
            )} */}
          </Link>
          {role === USER_ROLE.VALUES.Admin && (
            <div>
              <Text strong>Action:</Text>
              <span>
                <DeleteOutlined
                  onClick={(e) => {
                    handleDeleteInvoice(e, record);
                  }}
                />
              </span>
            </div>
          )}
        </div>
      ),
      responsive: ["xs"],
    },
    {
      title: "#",
      dataIndex: "id",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Issue Date",
      dataIndex: "createdAt",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Discount",
      dataIndex: "discount",
      align: "right",
      render: (text, record) => (text ? renderValueCell(convertToBD(text), record) : text),
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      align: "right",
      render: (text, record) => {
        const amountBDT = convertToBD(text);
        return renderValueCell(amountBDT, record);
      },
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (text) => {
        return <Tag color={INVOICE_STATUS.KEYS[text].color}>{INVOICE_STATUS.KEYS[text].text}</Tag>;
      },
      responsive: ["md", "lg", "xl", "xxl"],
    },
  ];
  if (role === USER_ROLE.VALUES.Admin) {
    columns.push({
      title: "Action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {/* <Link to={{ pathname: `/invoices/${record.invoiceId}` }}>
            <EyeOutlined />
          </Link> */}
          <span>
            <DeleteOutlined
              onClick={(e) => {
                handleDeleteInvoice(e, record);
              }}
            />
          </span>
        </Space>
      ),
      responsive: ["md", "lg", "xl", "xxl"],
    });
  }

  const handleDeleteInvoice = async (e, invoice) => {
    e.preventDefault();
    confirm({
      title: `Are you sure to delete the invoice?`,
      async onOk() {
        await invoiceService.delete(invoice.id, userId);
      },
    });
  };

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
      setSelectedInvoiceIds(selectedRowKeys);
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.paymentStatus !== "unpaid",
    //   // Column configuration not to be checked
    //   // name: record.name,
    // }),
  };

  return (
    <>
      {/* TODO: comment following lines in production */}
      {/* {children} */}
      <Row justify="end">
        <Col>
          {selectedInvoiceIds?.length ? (
            <Button
              // disabled={selectedInvoiceIds?.length ? false : true}
              // style={{ color: "white", background: "#73d13d" }}
              onClick={(e) => handleBulkDeleteInvoices(e, selectedInvoiceIds)}
            >
              Delete
            </Button>
          ) : null}
        </Col>
      </Row>
      <br />
      <Table
        size="small"
        loading={status === "loading"}
        columns={columns}
        dataSource={invoices}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        // onChange={onChange}
      />
    </>
  );
};
export default InvoiceListContainer;
