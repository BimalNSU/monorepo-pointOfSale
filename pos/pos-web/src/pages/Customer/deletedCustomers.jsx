import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Grid,
  Input,
  Modal,
  notification,
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
  RedoOutlined,
} from "@ant-design/icons";
import CustomerService from "@/service/customer.service";
import { useFirestore } from "reactfire";
import { useState } from "react";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { useDebounce } from "react-use";
import { USER_ROLE } from "@pos/shared-models";
import { useCustomers } from "@/api/useCustomers";
const { Text } = Typography;
const { confirm } = Modal;

const DeletedCustomers = () => {
  const { status, data } = useCustomers({ isDeleted: true });
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

  const handleRestoreCustomers = async () => {
    confirm({
      title: `Are you sure, want to restore this customer?`,
      async onOk() {
        try {
          await customerService.restore(selectedRowKeys, authUserId);
          notification.success({ title: "Selected customers restored successfully", duration: 2 });
        } catch (err) {
          notification.error({ title: "Fail to restore", duration: 2 });
        }
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
      {<Text>{text}</Text>}
    </Link>
  );

  const columns = [
    {
      dataIndex: "mobileIndex",
      key: "mobileIndex",
      render: (_, record) => (
        <div onClick={() => navigate(`/customers/${record.id}`)}>
          <Row justify="start" align="top">
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
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
                  trigger={["click"]}
                  popupRender={() => (
                    <Button
                      icon={<RedoOutlined />}
                      color="cyan"
                      variant="solid"
                      onClick={handleRestoreCustomers}
                    >
                      Restore ({selectedRowKeys.length})
                    </Button>
                  )}
                >
                  <Button icon={<MoreOutlined />} />
                </Dropdown>
              ) : (
                <Button
                  icon={<RedoOutlined />}
                  color="cyan"
                  variant="solid"
                  onClick={handleRestoreCustomers}
                >
                  Restore ({selectedRowKeys.length})
                </Button>
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
export default DeletedCustomers;
