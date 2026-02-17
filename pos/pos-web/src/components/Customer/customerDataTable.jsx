import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Grid,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
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
import { useState } from "react";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { useDebounce } from "react-use";
import { USER_ROLE } from "@pos/shared-models";
const { Text } = Typography;
const { confirm } = Modal;

const CustomerDataTable = ({ status, data }) => {
  const navigate = useNavigate();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const { userId: authUserId, session } = useFirebaseAuth();
  const db = useFirestore();
  const customerService = new CustomerService(db);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);

  useDebounce(
    () => {
      if (!data?.length) {
        setCustomers([]);
        return;
      }
      if (!search) {
        setCustomers(data.map((u) => ({ ...u, key: u.id })));
        return;
      }
      const pattern = new RegExp(`(${search || ""})`, "i");
      setCustomers(
        data
          .map((u) => ({ ...u, key: u.id }))
          .filter(
            (c) =>
              pattern.test(c.firstName) || pattern.test(c.mobile) || pattern.test(c.email || ""),
          ),
      );
    },
    300,
    [data, search],
  );
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
          await Promise.all(
            selectedRowKeys.map((id) => customerService.softDelete(id, authUserId)),
          );
          setSelectedRowKeys([]);
        } catch (err) {}
      },
    });
  };

  const handleBulkExport = () => {
    const selectedCustomers = customers.filter((c) => selectedRowKeys.includes(c.id));

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

  return (
    <Table
      title={() => (
        <Row gutter={[16, 10]} justify="space-between">
          <Col>
            <Input
              placeholder="Search by name, mobile or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
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
                    <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete}>
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
      dataSource={customers}
      rowSelection={rowSelection}
      rowKey="id"
    />
  );
};
export default CustomerDataTable;
