import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Grid,
  Input,
  Modal,
  notification,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  DeleteOutlined,
  DownOutlined,
  MoreOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import CustomerService from "@/service/customer.service";
import { useFirestore } from "reactfire";
import { useMemo, useState } from "react";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { useDebounce } from "react-use";
import { USER_ROLE } from "@pos/shared-models";
const { Text } = Typography;
const { confirm } = Modal;
const { Search } = Input;

const CustomerDataTable = ({ status, data }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const { userId: authUserId, session } = useFirebaseAuth();
  const db = useFirestore();
  const customerService = new CustomerService(db);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useDebounce(
    () => {
      if (!data?.length) {
        setFilteredCustomers([]);
        return;
      }
      if (!search) {
        setFilteredCustomers(data.map((u) => ({ ...u, key: u.id })));
        return;
      }
      const pattern = new RegExp(`(${search || ""})`, "i");
      setFilteredCustomers(
        data
          .map((u) => ({ ...u, key: u.id }))
          .filter(
            (c) =>
              pattern.test(c.firstName) || pattern.test(c.mobile) || pattern.test(c.email || ""),
          ),
      );
    },
    500,
    [data, search],
  );
  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, page, pageSize]);
  const handleRemoveCustomer = async (e, record) => {
    confirm({
      title: `Are you sure, want to delete this customer?`,
      async onOk() {
        try {
          await customerService.softDelete(record.id, authUserId);
        } catch (err) {}
      },
    });
  };
  const handleRestoreCustomer = async (e, record) => {
    confirm({
      title: `Are you sure, want to restore this customer?`,
      async onOk() {
        try {
          await customerService.restore(record.id, authUserId);
        } catch (err) {}
      },
    });
  };
  const renderValueCell = (text, record) => (
    <Link
      to={{ pathname: `/customers/${record.id}` }}
      style={{
        color: "black",
        textDecoration: "none",
      }}
    >
      {record.isDeleted ? <Text type="danger">{text}</Text> : text}
    </Link>
  );

  const renderActionItems = (record) => {
    const arr = [];
    if (record.isDeleted) {
      arr.push({
        key: "1",
        label: <span style={{ fontSize: 14 }}>{"Restore"}</span>,
        icon: <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 20 }} />,
        onClick: (e) => handleRestoreCustomer(e, record),
      });
    } else {
      arr.push({
        key: "1",
        label: <span style={{ fontSize: 14 }}>{"Delete"}</span>,
        icon: <DeleteOutlined />,
        onClick: (e) => handleRemoveCustomer(e, record),
        danger: true,
      });
    }
    return arr;
  };
  const columns = [
    {
      dataIndex: "mobileIndex",
      key: "mobileIndex",
      render: (_, record) => (
        <div onClick={() => navigate(`/customers/${record.id}`)}>
          {/* <Card
          size="small"
          style={{
            // marginBottom: 16,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            borderRadius: 8,
          }}
          styles={{
            body: {
              marginLeft: 8,
              marginRight: 8,
              marginTop: 8,
            },
          }}
          hoverable
          onClick={() => navigate(`/customers/${record.id}`)}
        > */}
          <Row justify="space-between" align="top">
            <Col>
              <Space>
                <Avatar icon={<UserOutlined />} />
                <div>
                  <div style={{ fontWeight: 500 }}>{record.firstName}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    #{record.id} · {record.createdAt}
                  </div>
                </div>
              </Space>
            </Col>
            {session.role === USER_ROLE.VALUES.Admin && (
              <Col>
                <div
                  onClick={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()} // For mobile touch
                  // onMouseEnter={(e) => e.stopPropagation()} // For desktop hover
                  style={{
                    padding: 8,
                    marginRight: -8,
                    marginTop: -8,
                    borderRadius: 4,
                  }}
                >
                  <Dropdown menu={{ items: renderActionItems(record) }} trigger={["click"]}>
                    {/* <MoreOutlined style={{ fontSize: 18, cursor: "pointer" }} /> */}
                    <span
                      onClick={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                    >
                      <MoreOutlined style={{ fontSize: 18 }} />
                    </span>
                  </Dropdown>
                </div>
              </Col>
            )}
          </Row>

          <div style={{ marginTop: 10 }} onClick={(e) => e.stopPropagation()}>
            <Text strong style={{ marginRight: "3px" }}>
              Mobile:
            </Text>
            <a href={`tel:${record.mobile}`} style={{ color: "#1677ff" }}>
              {record.mobile}
            </a>
          </div>
          <div style={{ marginTop: 10 }}>
            <Text strong style={{ marginRight: "3px" }}>
              Email:
            </Text>
            <span>{record.email ?? "N/A"}</span>
          </div>
        </div>
      ),
      responsive: ["xs"],
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "#",
      dataIndex: "id",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Name",
      dataIndex: "firstName",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Email",
      dataIndex: "email",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
  ];
  if (session.role === USER_ROLE.VALUES.Admin) {
    columns.push({
      title: "Action",
      dataIndex: "action",
      align: "center",
      width: 90,

      fixed: "right",
      // width: "25%",
      render: (_, record) => (
        <Space size="middle">
          <div
            style={{
              padding: "3px",
              position: "relative",
              backgroundColor: "#fff",
              border: "1px solid #d9d9d9",
              borderRadius: "2px",
            }}
          >
            <Dropdown menu={{ items: renderActionItems(record) }}>
              <a style={{ color: "black", textDecoration: "none" }}>
                Select <DownOutlined />
              </a>
            </Dropdown>
          </div>
        </Space>
      ),
      responsive: ["md", "lg", "xl", "xxl"],
    });
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleBulkDelete = () => {
    confirm({
      title: `Delete ${selectedRowKeys.length} customers?`,
      async onOk() {
        try {
          await customerService.softDeletes(selectedRowKeys, authUserId);
          notification.success({ title: "Selected customers deleted successfully", duration: 2 });
          setSelectedRowKeys([]);
        } catch (err) {
          notification.error({ title: "Fail to delete", duration: 2 });
        }
      },
    });
  };

  const handleBulkExport = () => {
    const selectedCustomers = paginatedCustomers.filter((c) => selectedRowKeys.includes(c.id));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["ID", "Name", "Mobile", "Email"],
        ...selectedCustomers.map((c) => [c.id, c.firstName, c.mobile, c.email ?? ""]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
  };

  const updateParams = (newParams) => {
    setSearchParams({
      page: newParams.page ?? page,
      limit: newParams.limit ?? pageSize,
      ...(newParams.search && { search: newParams.search ?? search }),
    });
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          margin: "3px 8px 0 0",
        }}
      >
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filteredCustomers.length}
          onChange={(p) => updateParams({ page: p })}
          size="small"
          showSizeChanger={false}
        />
      </div>
      <Table
        title={() => (
          <Row gutter={[16, 10]} justify="space-between">
            <Col>
              <Input
                placeholder="Search by name, mobile or email"
                value={search}
                // onChange={(e) => setSearch(e.target.value)}
                onChange={(e) => updateParams({ page: 1, search: e.target.value })}
                allowClear
              />
              {/* <Search
                placeholder="Search customer"
                defaultValue={search}
                onSearch={(value) => updateParams({ page: 1, search: value })}
                style={{ width: 250, marginBottom: 16 }}
              /> */}
            </Col>
            <Col>
              {selectedRowKeys.length > 0 &&
                (isMobile ? (
                  <Dropdown
                    menu={{
                      items: [
                        ...(session.role === USER_ROLE.VALUES.Admin
                          ? [
                              {
                                key: "delete",
                                label: "Delete Selected",
                                icon: <DeleteOutlined />,
                                danger: true,
                                onClick: handleBulkDelete,
                              },
                            ]
                          : []),
                        {
                          key: "export",
                          label: "Export Selected",
                          icon: <ExportOutlined />,
                          onClick: handleBulkExport,
                        },
                      ],
                    }}
                  >
                    <Button icon={<MoreOutlined />} />
                  </Dropdown>
                ) : (
                  <Space>
                    {session.role === USER_ROLE.VALUES.Admin && (
                      <Button
                        color="danger"
                        variant="solid"
                        icon={<DeleteOutlined />}
                        onClick={handleBulkDelete}
                      >
                        Delete ({selectedRowKeys.length})
                      </Button>
                    )}
                    <Button icon={<ExportOutlined />} onClick={handleBulkExport}>
                      Export
                    </Button>
                  </Space>
                ))}
            </Col>
          </Row>
        )}
        size="small"
        loading={status === "loading"}
        columns={columns}
        dataSource={paginatedCustomers}
        pagination={false}
        rowSelection={rowSelection}
        rowKey="id"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          margin: "8px 8px 0 8px",
        }}
      >
        {/* Page Size */}
        <Select
          size="middle"
          value={pageSize}
          onChange={(value) => updateParams({ limit: value })}
          // style={{
          //   width: isMobile ? "45%" : 140,
          //   minWidth: 120,
          // }}
          options={[
            { value: 10, label: "10 / page" },
            { value: 20, label: "20 / page" },
            { value: 50, label: "50 / page" },
          ]}
        />
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filteredCustomers.length}
          onChange={(p) => updateParams({ page: p })}
          size="small"
          showSizeChanger={false}
          // simple={isMobile}
          // style={{
          //   width: isMobile ? "50%" : "auto",
          //   textAlign: isMobile ? "right" : "right",
          // }}
        />
      </div>
    </>
  );
};
export default CustomerDataTable;
