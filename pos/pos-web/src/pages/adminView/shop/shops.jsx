import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Modal,
  notification,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { USER_ROLE } from "@pos/shared-models";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import ShopService from "@/service/shop.service";
import { useFirestore } from "reactfire";
import { useMemo } from "react";
import { useShops } from "@/api/useShops";
import { success } from "@/utils/Utils/Utils";
import styles from "../../../posButton.module.css";
import customAntdStyles from "../../../customAntd.module.css";
const { Text } = Typography;
const { confirm } = Modal;

const Shops = () => {
  const navigate = useNavigate();
  const { userId, getToken, session } = useFirebaseAuth();
  const db = useFirestore();
  const shopService = new ShopService(db);
  const { status, data } = useShops();

  const shops = useMemo(() => data?.map((p) => ({ ...p, key: p.id })) ?? [], [data]);

  const handleDeleteShop = (e, record) => {
    // e.preventDefault();
    confirm({
      title: `Are you sure to delete the shop?`,
      async onOk() {
        try {
          const idToken = await getToken();
          await shopService.softDelete(record.id, idToken, session.id);
          success(`Shop is deleted successfully`);
        } catch (e) {
          console.log(e);
        }
      },
    });
  };
  const handleRestoreShop = async (e, record) => {
    confirm({
      title: `Are you sure to restore the shop?`,
      async onOk() {
        try {
          await shopService.restore(record.id, userId);
          notification.success({ message: `Shop restored successfully`, duration: 2 });
        } catch (e) {
          notification.error({ message: `Fail shop restoration`, duration: 2 });
        }
      },
    });
  };
  const renderActionItems = (record) => [
    {
      key: "1",
      label: <span style={{ fontSize: 14 }}>{!record.isDeleted ? "Delete" : "Restore"}</span>,
      icon: !record.isDeleted ? (
        <DeleteOutlined style={{ fontSize: 20 }} />
      ) : (
        <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 20 }} />
      ),
      onClick: (e) =>
        record.isDeleted ? handleRestoreShop(e, record) : handleDeleteShop(e, record),
      danger: !record.isDeleted,
    },
    // {
    //   key: "2",
    //   label: <a onClick={(e) => handleDeleteShop(e, record)}>{"Delete"}</a>,
    //   icon: <DeleteOutlined />,
    //   danger: true,
    // },
  ];
  const renderValueCell = (text, record) => (
    <Link
      to={{ pathname: `/shops/${record.id}` }}
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
          onClick={() => navigate(`/shops/${record.id}`)}
        >
          <Row justify="space-between" align="top">
            <Col>
              <Space>
                <Avatar icon={<ShopOutlined />} />
                <div>
                  <div style={{ fontWeight: 500 }}>{record.name}</div>
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

          <div
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
              overflow: "hidden",
            }}
          >
            <Text strong style={{ whiteSpace: "nowrap" }}>
              Address:
            </Text>
            <Text
              style={{
                color: "#1677ff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {record.address ?? "N/A"}
            </Text>
          </div>

          <Row justify="space-between" style={{ marginTop: 8 }}>
            <Col>
              <Text strong>Code:</Text> {record.code}
            </Col>
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
      width: "15%",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "#",
      dataIndex: "id",
      width: "10%",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },

    {
      title: "Name",
      dataIndex: "name",
      width: "10%",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Address",
      dataIndex: "address",
      width: "30%",
      render: (text, record) => renderValueCell(text ?? "N/A", record),
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Code",
      dataIndex: "code",
      width: "5%",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Action",
      align: "center",
      width: "5%",
      render: (_, record) => (
        <Button
          type="text"
          danger={!record.isDeleted}
          icon={record.isDeleted ? <CheckCircleOutlined /> : <DeleteOutlined />}
          onClick={(e) => {
            record.isDeleted ? handleRestoreShop(e, record) : handleDeleteShop(e, record);
          }}
        >
          {record.isDeleted ? "Restore" : "Delete"}
        </Button>
      ),
      responsive: ["md", "lg", "xl", "xxl"],
    },
  ];
  return (
    <Card title="Shop List" bordered={false} className={customAntdStyles.mobileCardBody}>
      <Table
        title={() => (
          <Row gutter={[16, 1]} justify="end">
            <Link
              to={{ pathname: "/shops/add" }}
              style={{
                color: "black",
                textDecoration: "none",
              }}
            >
              <Button className={styles.posBtn} icon={<PlusOutlined />}>
                Add Shop
              </Button>
            </Link>
          </Row>
        )}
        size="small"
        loading={status === "loading"}
        columns={columns}
        dataSource={shops}
        // rowSelection={{
        //   type: "checkbox",
        //   ...rowSelection,
        // }}
        // onChange={onChange}
      />
    </Card>
  );
};
export default Shops;
