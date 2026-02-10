import { Table, Typography } from "antd";
import { useCategories } from "@/api/categoryList";
import { USER_ROLE } from "@pos/shared-models";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

const CategoryList = () => {
  const { status, data } = useCategories();
  const columns = [
    {
      dataIndex: "mobileIndex",
      key: "mobileIndex",
      render: (text, record) => (
        <div>
          <Link
            to={{ pathname: `/categories/${record.id}` }}
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
            <Text strong>Name:</Text> {record.name}
          </Link>
          {USER_ROLE.VALUES.Admin === authRole && (
            <div>
              <Text strong>Action:</Text>{" "}
              <span>
                <DeleteOutlined
                  onClick={(e) => {
                    handleDelete(e, record);
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
      title: "Date",
      dataIndex: "createdAt",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Name",
      dataIndex: "name",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
  ];
  return (
    <Table
      size="small"
      loading={status === "loading"}
      columns={columns}
      dataSource={data}
      // rowSelection={{
      //   type: "checkbox",
      //   ...rowSelection,
      // }}
      // onChange={onChange}
    />
  );
};
export default CategoryList;
