import { Card, Modal, Table, Typography } from "antd";
import { useUsers } from "@/api/useUsers";
import { ROLE_STATUS, USER_ROLE } from "@/constants/role";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import ProductService from "@/service/product.service";
import { useFirestore } from "reactfire";
import { useMemo } from "react";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
const { Text } = Typography;
const { confirm } = Modal;

const Users = () => {
  const { userId } = useFirebaseAuth();
  const db = useFirestore();
  const productService = new ProductService(db);
  const { status, data } = useUsers();

  const users = useMemo(() => data?.map((u) => ({ ...u, key: u.id })) ?? [], [data]);

  const handleDeleteUser = (e, record) => {
    e.preventDefault();
    confirm({
      title: `Are you sure to delete the user?`,
      async onOk() {
        await productService.delete(record.id, userId);
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
  const columns = [
    {
      dataIndex: "mobileIndex",
      key: "mobileIndex",
      render: (_, record) => (
        <div>
          <Link
            to={{ pathname: `/users/${record.id}` }}
            style={{
              color: "black",
              textDecoration: "none",
            }}
          >
            <Text strong>#:</Text> {record.id}
            <br />
            <Text strong>Date:</Text> {record.createdAt}
            <br />
            <Text strong>Name:</Text>{" "}
            {`${record.firstName}${record.lastName ? ` ${record.lastName}` : ""}`}
            <br />
            <Text strong>Role:</Text> {USER_ROLE.KEYS[record.role]}
            <br />
            <Text strong>Status:</Text> {ROLE_STATUS.KEYS[record.status].text}
          </Link>
          <div>
            <Text strong>Action:</Text>{" "}
            <span>
              <DeleteOutlined
                onClick={(e) => {
                  handleDeleteUser(e, record);
                }}
              />
            </span>
          </div>
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
      title: "Date",
      dataIndex: "createdAt",
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
      title: "Role",
      dataIndex: "role",
      render: (text, record) => renderValueCell(USER_ROLE.KEYS[text], record),
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => renderValueCell(ROLE_STATUS.KEYS[text].text, record),
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <span>
          <DeleteOutlined
            onClick={(e) => {
              handleDeleteUser(e, record);
            }}
          />
        </span>
      ),
      responsive: ["md", "lg", "xl", "xxl"],
    },
  ];
  return (
    <Card
      title="User List"
      bordered={false}
      style={{
        // width: 300,
        margin: "10px",
      }}
    >
      <Table
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
