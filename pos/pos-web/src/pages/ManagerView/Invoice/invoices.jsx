import React, { useMemo, useState } from "react";
import { useFirestore } from "reactfire";
import dayjs from "dayjs";

import {
  Button,
  Select,
  message,
  Row,
  Typography,
  Col,
  Table,
  Input,
  Space,
  Modal,
  Tag,
  Badge,
  Image,
  Card,
} from "antd";
import {
  FilePdfOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
// import { removeInvoice, removeInvoices } from "@/api/manager/invoiceFunctions";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "@/constants/dateFormat";
import { useDebounce } from "react-use";
import { INVOICE_STATUS } from "@/constants/paymentStatus";
import { convertToBD } from "@/constants/currency";
import inAppLogo from "@/images/check.png";
import smsLogo from "@/images/comment.png";
import mailLogo from "@/images/mail.png";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import { useInvoices } from "@/api/useInvoices";
import InvoiceService from "@/service/invoice.service";
import { USER_ROLE } from "@/constants/role";

const { Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const Invoices = () => {
  const { userId, role } = useCustomAuth();
  const db = useFirestore();
  const invoiceService = new InvoiceService(db);
  const { status, data: invoices } = useInvoices();
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState();

  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState([]);
  const [searchableFields, setSearchableFields] = useState([]);
  const defaultSearchableFields = ["id", "createdAt", "dueDate", "month", "invoiceTotalAmount"];

  // if (authRole === "manager" || authRole === "owner") {
  //   defaultSearchableFields.push("billTo");
  // }
  // if (authRole === "owner" || authRole === "tenant") {
  //   defaultSearchableFields.push("propertyName");
  // }
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

  // const handleDeleteCurrentMonthInvoiceData = async (e) => {
  //   // const currentMonth = dayjs(currentDateTime).format("MMMM");
  //   const currentMonth = dayjs().format("MMMM");
  //   e.preventDefault();
  //   const currentMonthsInvoices = processInvoices
  //     .filter((invoice) => invoice.month === currentMonth)
  //     .map((invoice) => ({
  //       invoiceId: invoice.id,
  //       transferredInvoiceIds: invoice.transferredInvoiceIds,
  //     }));
  //   showConfirm(currentMonthsInvoices, currentMonth);
  // };
  // const showConfirm = async (data, currentMonth) => {
  //   confirm({
  //     title: `Are you sure to delete all invoices of current month?`,
  //     async onOk() {
  //       // await deleteDoc(doc(record.ownerCollectionRef, record.ownerId))
  //       // await removeInvoices(firestore, data, authUserId);
  //     },
  //   });
  // };
  const handleDeleteInvoice = async (e, invoice) => {
    e.preventDefault();
    confirm({
      title: `Are you sure to delete the invoice?`,
      async onOk() {
        await invoiceService.delete(invoice.id, userId);
      },
    });
  };

  // useDebounce(
  //   () => {
  //     //restore unfiltered data to dataTable
  //     if (!searchTerm) {
  //       setTableData(invoices);
  //     } //filter owners dataTable data
  //     else {
  //       const pattern = new RegExp(`(${searchTerm || ""})`, "i");
  //       if (!searchableFields.length) {
  //         //if the user doesn't choose any column's field
  //         // return filtered invoices data by matching the user's input on each column of the invoice list
  //         const filterData = invoices.filter((row) =>
  //           defaultSearchableFields.some((name) =>
  //             pattern.test(typeof row[name] === "number" ? `${row[name]}` : row[name]),
  //           ),
  //         );
  //         setTableData(filterData);
  //       } else if (searchableFields.length) {
  //         //return filtered invoices data by matching the user's input to selected columns
  //         const filterData = invoices.filter((row) =>
  //           searchableFields.some((name) =>
  //             pattern.test(typeof row[name] === "number" ? `${row[name]}` : row[name]),
  //           ),
  //         );
  //         setTableData(filterData);
  //       }
  //     }
  //   },
  //   300, //delay in search in miliseconds
  //   [searchableFields, searchTerm, invoices],
  // );

  function onSelectFilterType(value) {
    //check and add unique selected name
    if (searchableFields.indexOf(value) === -1) {
      setSearchableFields([...searchableFields, value]);
    }
  }
  function onDelectFilterType(value) {
    //remove deselected dropDown field's name
    const selectedFields = searchableFields.filter((item) => item !== value);
    setSearchableFields(selectedFields);
  }
  const onChangeInput = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
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

  // const t = dayjs("2022/05/22", "YYYY/MM/DD").add(5, 'days')
  // const t = dayjs(currentYearMonth1, "YYYY/MM/DD").add(10, 'days')
  // const tt = dayjs(currentYearMonth1, "YYYY/MM/DD").add(12-1, 'days').format("YYYY/MM/DD")
  // const t = dayjs(currentDateTime, "YYYY/MM/DD").diff(dayjs("2022/01/22", "YYYY/MM/DD").add(5, 'months'))

  return (
    <Card
      title="Invoice List"
      bordered={false}
      style={{
        margin: "10px",
      }}
    >
      {/* TODO: comment following lines in production */}
      {/* {children} */}
      <Row justify="space-between">
        <Col>
          {/* <Row gutter={[10, 1]}>
            <Col>
              {pmsMenu.list.length > 0 ? (
                <Select
                  mode="multiple"
                  style={{ width: "150px" }}
                  placeholder={pmsMenu.dropDownName}
                  onSelect={onSelectFilterType}
                  onDeselect={onDelectFilterType}
                >
                  {pmsMenu.list.map((selectItem) => (
                    <Option key={selectItem.dataIndex} value={selectItem.dataIndex}>
                      {selectItem.title}
                    </Option>
                  ))}
                </Select>
              ) : null}
            </Col>
            <Col>
              <Input
                width={100}
                className="header-search"
                placeholder="Type here..."
                prefix={<SearchOutlined />}
                onChange={onChangeInput}
              />
            </Col>
          </Row> */}
        </Col>
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
    </Card>
  );
};
export default Invoices;
