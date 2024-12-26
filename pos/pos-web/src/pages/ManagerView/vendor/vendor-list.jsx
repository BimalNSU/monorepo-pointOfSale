import { useVendorList } from "@/api/vendor/useVendorList";
import { useCustomProperty } from "@/utils/hooks/customProperty";
import { Button, Col, Row, Table, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

const VendorList = () => {
  const { propertyId } = useCustomProperty();
  const { status, data } = useVendorList(propertyId);
  const navigate = useNavigate();
  const renderValueCell = (text, record) => (
    <Link
      to={{ pathname: `/vendors/${record.id}/view` }}
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
            to={{ pathname: `/vendors/${record.id}/view` }}
            style={{
              color: "black",
              textDecoration: "none",
            }}
          >
            {record.isDeleted ? <Text type="danger">{text}</Text> : text}
            <Text strong>ID:</Text> {record.id}
            <br />
            <Text strong>Name:</Text> {record.name}
            <br />
            <Text strong>Mobile:</Text> {record.mobile}
            <br />
            <Text strong>Email:</Text> {record.email || "N/A"}
            <br />
            <Text strong>Address:</Text> {record.address || "N/A"}
          </Link>
        </div>
      ),
      responsive: ["xs"],
    },
    {
      title: "ID",
      dataIndex: "id",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Name",
      dataIndex: "name",
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
      render: (text, record) => (text ? renderValueCell(text, record) : "N/A"),
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Address",
      dataIndex: "address",
      render: (text, record) => (text ? renderValueCell(text, record) : "N/A"),
      responsive: ["md", "lg", "xl", "xxl"],
    },
  ];

  return (
    <div className="addPadding-10">
      <div className={`border p-3 rounded`}>
        <Row justify="space-between">
          <Col></Col>
          <Col>
            <Button onClick={() => navigate("/vendors/create")}>Add Vendor</Button>
          </Col>
        </Row>
        <Table size="small" columns={columns} loading={status === "loading"} dataSource={data} />
      </div>
    </div>
  );
};
export default VendorList;
