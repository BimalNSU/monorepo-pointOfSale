import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useCustomers } from "@/api/useCustomers";
import { Link, useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  MoreOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import CustomerService from "@/service/customer.service";
import { useFirestore } from "reactfire";
import { useState } from "react";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import styles from "../../posButton.module.css";
import customAntdStyles from "../../customAntd.module.css";
import { useDebounce } from "react-use";
const { Text } = Typography;
const { confirm } = Modal;

const Customers = () => {
  const navigate = useNavigate();
  const { userId: authUserId } = useFirebaseAuth();
  const db = useFirestore();
  const customerService = new CustomerService(db);
  const { status, data } = useCustomers();
  //   const customers = useMemo(() => data?.map((u) => ({ ...u, key: u.id })) ?? [], [data]);
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
              pattern.test(c.firstName) ||
              pattern.test(c.lastName || "") ||
              pattern.test(c.mobile) ||
              pattern.test(c.email || ""),
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
        <Card
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
        >
          <Row justify="space-between" align="top">
            <Col>
              <Space>
                <Avatar icon={<UserOutlined />} />
                <div>
                  <div style={{ fontWeight: 500 }}>
                    {record.firstName} {record.lastName}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    #{record.id} · {record.createdAt}
                  </div>
                </div>
              </Space>
            </Col>
            {record.id !== authUserId && (
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

          <Row justify="space-between" style={{ marginTop: 8 }}>
            {/* <Col>
              <Text strong>Role:</Text> {USER_ROLE.KEYS[record.role]}
            </Col> */}
            <Col>
              <Text strong>{`Status: `}</Text>
              {!record.isDeleted ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              )}
            </Col>
          </Row>
        </Card>
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
      render: (_, record) =>
        renderValueCell(
          `${record.firstName}${record.lastName ? ` ${record.lastName}` : ""}`,
          record,
        ),
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
    {
      title: "Status",
      dataIndex: "isDeleted",
      render: (text, record) => {
        const statusTag = !text ? (
          <Tag color="success">Active</Tag>
        ) : (
          <Tag color="error">Inactive</Tag>
        );
        // const statusTag = (
        //   <Select
        //     style={{ width: 120 }}
        //     // onChange={handleChange}
        //     options={[
        //       { value: true, label: "Active" },
        //       { value: false, label: "Inactive" },
        //     ]}
        //   ></Select>
        // );
        return renderValueCell(statusTag, record);
      },
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      width: 90,

      fixed: "right",
      // width: "25%",
      render: (_, record) =>
        record.id !== authUserId && (
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
    },
  ];
  return (
    <Card title="Customer List" variant={false} className={customAntdStyles.mobileCardBody}>
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
              <Link
                to={{ pathname: "/customers/add" }}
                style={{
                  color: "black",
                  textDecoration: "none",
                }}
              >
                <Button className={styles.posBtn} icon={<PlusOutlined />}>
                  Add Customer
                </Button>
              </Link>
            </Col>
          </Row>
        )}
        size="small"
        loading={status === "loading"}
        columns={columns}
        dataSource={customers}
        // rowSelection={{
        //   type: "checkbox",
        //   ...rowSelection,
        // }}
        // onChange={onChange}
      />
    </Card>
  );
};
export default Customers;
