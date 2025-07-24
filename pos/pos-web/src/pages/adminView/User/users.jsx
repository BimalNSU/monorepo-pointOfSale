import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useUsers } from "@/api/useUsers";
import { USER_ROLE } from "@/constants/role";
import { Link } from "react-router-dom";
import {
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  MoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import UserService from "@/service/user.service";
import { useFirestore } from "reactfire";
import { useMemo } from "react";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import styles from "../../../posButton.module.css";
const { Text } = Typography;
const { confirm } = Modal;

const Users = () => {
  const { userId } = useFirebaseAuth();
  const db = useFirestore();
  const userService = new UserService(db);
  const { getToken, session } = useFirebaseAuth();
  const { status, data } = useUsers();
  const users = useMemo(() => data?.map((u) => ({ ...u, key: u.id })) ?? [], [data]);

  const handleRoleStatus = async (e, record) => {
    const verb = record.isActive ? "de-activate" : "activate";
    confirm({
      title: `Are you sure to ${verb} user role?`,
      async onOk() {
        try {
          const idToken = await getToken();
          await userService.updateStatus(
            record.id,
            { isActive: !record.isActive },
            idToken,
            session.id,
          );
        } catch (error) {
          // TODO: to be implemented
        }
      },
    });
  };
  const handleRemoveUser = async (e, record) => {
    confirm({
      title: `Are you sure to remove user?`,
      async onOk() {
        try {
          const idToken = await getToken();
          await userService.updateStatus(record.id, { isDeleted: true }, idToken, session.id);
        } catch (error) {
          // TODO: to be implemented
        }
      },
    });
  };
  const renderValueCell = (text, record) => (
    <Link
      to={{ pathname: `/users/${record.id}` }}
      style={{
        color: "black",
        textDecoration: "none",
      }}
    >
      {record.isDeleted ? <Text type="danger">{text}</Text> : text}
    </Link>
  );
  const renderActionItems = (record) => [
    {
      key: "1",
      label: (
        <a
          onClick={(e) => {
            handleRoleStatus(e, record);
          }}
        >
          {record.isActive ? "De-activate" : "Activate"}
        </a>
      ),
      icon: <DeleteOutlined />,
      danger: record.isActive,
    },
    {
      key: "2",
      label: (
        <a
          onClick={(e) => {
            handleRemoveUser(e, record);
          }}
        >
          {"Delete"}
        </a>
      ),
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];
  const columns = [
    {
      dataIndex: "mobileIndex",
      key: "mobileIndex",
      render: (_, record) => (
        <Card
          size="small"
          style={{
            marginBottom: 16,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            borderRadius: 8,
            body: { padding: 12 },
          }}
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
            {record.id !== userId && (
              <Col>
                <Dropdown menu={{ items: renderActionItems(record) }} trigger={["click"]}>
                  <MoreOutlined style={{ fontSize: 18, cursor: "pointer" }} />
                </Dropdown>
              </Col>
            )}
          </Row>

          <div style={{ marginTop: 10 }}>
            <Text strong>Mobile:</Text>
            <a href={`tel:${record.mobile}`} style={{ color: "#1677ff" }}>
              {record.mobile}
            </a>
          </div>

          <Row justify="space-between" style={{ marginTop: 8 }}>
            <Col>
              <Text strong>Role:</Text> {USER_ROLE.KEYS[record.role]}
            </Col>
            <Col>
              <Text strong>Status:</Text>
              {record.isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
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
      title: "Role",
      dataIndex: "role",
      render: (text, record) => renderValueCell(USER_ROLE.KEYS[text], record),
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (text, record) => {
        const statusTag = text ? (
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
        record.id !== userId && (
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
    <Card
      title="User List"
      bordered={false}
      styles={{
        // width: 300,
        // margin: "10px",
        body: {
          paddingTop: 2,
          paddingBottom: 16,
        },
      }}
    >
      <Table
        title={() => (
          <Row gutter={[16, 1]} justify="end">
            <Link
              to={{ pathname: "/users/add" }}
              style={{
                color: "black",
                textDecoration: "none",
              }}
            >
              <Button className={styles.posBtn} icon={<PlusOutlined />}>
                Add User
              </Button>
            </Link>
          </Row>
        )}
        size="small"
        loading={status === "loading"}
        columns={columns}
        dataSource={users}
        // rowSelection={{
        //   type: "checkbox",
        //   ...rowSelection,
        // }}
        // onChange={onChange}
      />
    </Card>
  );
};
export default Users;
