import { Avatar, Col, Dropdown, Row, Space, Table, TableProps, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  DownOutlined,
  MoreOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useCallback, useMemo } from "react";
import { Customer, FetchStatus, WithId } from "@pos/shared-models";

const { Text } = Typography;
interface CustomerRow extends Omit<WithId<Customer>, "createdAt"> {
  createdAt: string;
}
type CustomerTableProps = {
  isAdmin: boolean;
  data: CustomerRow[];
  status: FetchStatus;
  searchTerm?: string | null;

  selectedRowKeys: string[];
  onSelectionChange: (keys: React.Key[]) => void;

  onDelete: (customer: CustomerRow) => void;
  onRestore: (customer: CustomerRow) => void;
};

const CustomerTable = ({
  isAdmin = false,
  status,
  data,
  searchTerm,
  selectedRowKeys,
  onSelectionChange,
  onDelete,
  onRestore,
}: CustomerTableProps) => {
  const navigate = useNavigate();

  const searchRegex = useMemo(() => {
    if (!searchTerm) return null;
    const safeSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(safeSearch, "gi");
  }, [searchTerm]);

  const renderValueCell = (text: any, record: CustomerRow) => (
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

  //prevents re-creation every render.
  const highlightText = useCallback(
    (text: string): React.ReactNode => {
      if (!searchTerm || !text) {
        return text;
      }

      const elements: React.ReactNode[] = [];
      let lastIndex = 0;

      String(text).replace(searchRegex!, (match, offset) => {
        // Push text before match
        if (offset > lastIndex) {
          elements.push(text.slice(lastIndex, offset));
        }

        // Push highlighted match
        elements.push(
          <span
            key={offset}
            style={{
              backgroundColor: "#ffc069",
              padding: "0 2px",
              borderRadius: "2px",
            }}
          >
            {match}
          </span>,
        );

        lastIndex = offset + match.length;
        return match;
      });

      // Push remaining text
      if (lastIndex < text.length) {
        elements.push(text.slice(lastIndex));
      }
      return elements;
    },
    [searchTerm],
  );

  const renderActionItems = (record: CustomerRow) => {
    const arr = [];
    if (record.isDeleted) {
      arr.push({
        key: "1",
        label: <span style={{ fontSize: 14 }}>{"Restore"}</span>,
        icon: <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 20 }} />,
        // onClick: (e: any) => handleRestoreCustomer(e, record),
        onClick: () => onRestore(record),
      });
    } else {
      arr.push({
        key: "1",
        label: <span style={{ fontSize: 14 }}>{"Delete"}</span>,
        icon: <DeleteOutlined />,
        // onClick: (e: any) => handleRemoveCustomer(e, record),
        onClick: () => onDelete(record),
        danger: true,
      });
    }
    return arr;
  };
  const columns: TableProps<CustomerRow>["columns"] = [
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
                  <div style={{ fontWeight: 500 }}>{highlightText(record.firstName)}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    #{highlightText(record.id)} · {record.createdAt}
                  </div>
                </div>
              </Space>
            </Col>
            {isAdmin && (
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
              {highlightText(record.mobile)}
            </a>
          </div>
          <div style={{ marginTop: 10 }}>
            <Text strong style={{ marginRight: "3px" }}>
              Email:
            </Text>
            <span>{record.email ? highlightText(record.email) : "N/A"}</span>
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
      render: (text: string, record) => renderValueCell(highlightText(text), record),
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Name",
      dataIndex: "firstName",
      render: (text, record) => renderValueCell(highlightText(text), record),
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      render: (text, record) => renderValueCell(highlightText(text), record),
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => (text ? renderValueCell(highlightText(text), record) : "N/A"),
      responsive: ["md", "lg", "xl", "xxl"],
    },
  ];
  if (isAdmin) {
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
    preserveSelectedRowKeys: true,
    onChange: onSelectionChange,
  };

  return (
    <Table
      size="small"
      loading={status === "loading"}
      columns={columns}
      dataSource={data}
      pagination={false}
      rowSelection={rowSelection}
      rowKey="id"
    />
  );
};
export default CustomerTable;
