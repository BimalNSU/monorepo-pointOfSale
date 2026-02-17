import { useState } from "react";
import { useFirestore } from "reactfire";

import { Button, Select, Row, Typography, Col, Table, Space, Modal, Tag, Card } from "antd";
import { DeleteOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { INVOICE_STATUS } from "@/constants/paymentStatus";
import { convertToBD } from "@/constants/currency";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import InvoiceService from "@/service/invoice.service";
import { USER_ROLE } from "@pos/shared-models";
import { useInvoicesPaginated } from "@/api/useInvoicesPaginated";

const { Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const Invoices = () => {
  const { userId, session } = useFirebaseAuth();
  const db = useFirestore();
  const [pageSize, setPageSize] = useState(10);
  const invoiceService = new InvoiceService(db);
  const {
    status,
    data: invoices,
    metaData,
    hasPreviousePage,
    hasNextPage,
    handleNextPage,
    handlePreviousPage,
  } = useInvoicesPaginated(pageSize);
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
      render: (_, record) => (
        <>
          <Link
            to={{ pathname: `/invoices/${record.id}` }}
            style={{ color: "black", textDecoration: "none" }}
          >
            <Row gutter={[16, 1]} justify="space-between">
              <Col span={24}>
                <Text strong>{`# `}</Text>
                <Text type={record.isDeleted ? "danger" : undefined}>{record.id}</Text>
              </Col>
              <Col span={24}>
                <Text strong>Date:</Text> {record.createdAt}
              </Col>
              <Col span={12}>
                <Text strong>Amount:</Text> {convertToBD(record.totalAmount)}
              </Col>
              <Col span={12}>
                <Text strong>Discount:</Text>
                {record.totalDiscount ? convertToBD(record.totalDiscount) : record.totalDiscount}
              </Col>
            </Row>
          </Link>
          <Row gutter={[16, 1]} justify="space-between">
            <Col span={12}>
              <Link
                to={{ pathname: `/invoices/${record.id}` }}
                style={{ color: "black", textDecoration: "none" }}
              >
                <Text strong>Status: </Text>
                <Tag color={INVOICE_STATUS.KEYS[record.status].color}>
                  {INVOICE_STATUS.KEYS[record.status].text}
                </Tag>
              </Link>
            </Col>
            {/* {(authRole === "manager" || authRole === "owner") && (
            <Col span={24}>
              <Text strong>Bill To:</Text> {record.billTo}
            </Col>
          )} */}
            {session.role === USER_ROLE.VALUES.Admin && (
              <Col span={12}>
                <Text strong>Action:</Text>
                <span>
                  <DeleteOutlined
                    onClick={(e) => {
                      handleDeleteInvoice(e, record);
                    }}
                  />
                </span>
              </Col>
            )}
          </Row>
        </>
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
      dataIndex: "totalDiscount",
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
  if (session.role === USER_ROLE.VALUES.Admin) {
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
    <Card title="Invoice List" variant="borderless" size="small">
      <Row justify="space-between" style={{ marginBottom: "5px" }}>
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
        <Col>
          <Row justify="end" gutter={[16, 1]}>
            <Col>
              <Text>
                {metaData.pageSize * (metaData.pageNo - 1) + 1}-
                {metaData.pageSize * metaData.pageNo}
              </Text>
            </Col>
            <Col>
              <Space orientation="horizontal">
                <Button
                  icon={<LeftOutlined />}
                  size="small"
                  disabled={!hasPreviousePage}
                  onClick={handlePreviousPage}
                  type="text"
                />
                <Button
                  icon={<RightOutlined />}
                  size="small"
                  disabled={!hasNextPage}
                  onClick={handleNextPage}
                  type="text"
                />
              </Space>
              <Select
                value={pageSize}
                onChange={(value) => setPageSize(value)}
                options={[10, 20, 30, 50].map((item) => ({ value: item, label: item }))}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Table
        size="small"
        loading={status === "loading"}
        columns={columns}
        dataSource={invoices}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        pagination={false}
        // onChange={onChange}
      />
    </Card>
  );
};
export default Invoices;
