import { ColumnsType } from "antd/es/table";
import { CustomerRow } from "../../customer.type";
import { Avatar, Button, Col, Drawer, Row, Space, Table, Typography } from "antd";
import { DeleteOutlined, DownloadOutlined, UserOutlined } from "@ant-design/icons";
const { Text } = Typography;
interface CustomerSelectionDrawerProps {
  open: boolean;
  customers: CustomerRow[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onExport: () => void;
  onDelete: () => void;
}

const CustomerSelectionDrawer = ({
  open,
  customers,
  onClose,
  onRemove,
  onClearAll,
  onExport,
  onDelete,
}: CustomerSelectionDrawerProps) => {
  const columns: ColumnsType<CustomerRow> = [
    {
      render: (_, record) => (
        <>
          <Row gutter={[16, 10]} justify="space-between" align="middle">
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
            <Col>
              <Button
                size="small"
                color="orange"
                variant="outlined"
                onClick={() => onRemove(record.id)}
              >
                Remove
              </Button>
            </Col>
          </Row>
          <div>
            <Text strong style={{ marginRight: "3px" }}>
              Mobile:
            </Text>
            {record.mobile}
          </div>
        </>
      ),
      responsive: ["xs"],
    },

    {
      title: "#",
      dataIndex: "id",
      responsive: ["md"],
      //    responsive: ["md", "lg", "xl", "xxl"]
    },

    {
      title: "Name",
      dataIndex: "firstName",
      responsive: ["md"],
    },

    {
      title: "Mobile",
      dataIndex: "mobile",
      responsive: ["md"],
    },

    {
      title: "Action",
      responsive: ["md"],
      render: (_, customer) => (
        <Button danger type="link" onClick={() => onRemove(customer.id)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="auto"
      title={`Selected Customers (${customers.length})`}
    >
      <Row gutter={[8, 8]} justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Button danger onClick={onClearAll}>
            Clear All
          </Button>
        </Col>

        <Col>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={onExport}>
              Export
            </Button>

            <Button color="danger" variant="solid" icon={<DeleteOutlined />} onClick={onDelete}>
              Delete
            </Button>
          </Space>
        </Col>
      </Row>

      <Table rowKey="id" columns={columns} dataSource={customers} size="small" />
    </Drawer>
  );
};
export default CustomerSelectionDrawer;
