import { Button, Card, Modal, Row, Table, Typography } from "antd";
import { USER_ROLE } from "@pos/shared-models";
import { Link } from "react-router-dom";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { convertToBD } from "@/constants/currency";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import ShopService from "@/service/shop.service";
import { useFirestore } from "reactfire";
import { useMemo } from "react";
import { useShops } from "@/api/useShops";
import { success } from "@/utils/Utils/Utils";
import styles from "../../../posButton.module.css";
const { Text } = Typography;
const { confirm } = Modal;

const Shops = () => {
  const { userId, getToken, session } = useFirebaseAuth();
  const db = useFirestore();
  const shopService = new ShopService(db);
  const { status, data } = useShops();

  const shops = useMemo(() => data?.map((p) => ({ ...p, key: p.id })) ?? [], [data]);

  const handleDeleteShop = (e, record) => {
    e.preventDefault();
    confirm({
      title: `Are you sure to delete the shop?`,
      async onOk() {
        try {
          const idToken = await getToken();
          await shopService.softDelete(record.id, idToken, session.id);
          success(`Shop ID ${record.id} is deleted successfully`);
        } catch (e) {
          console.log(e);
        }
      },
    });
  };
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
        <div>
          <Link
            to={{ pathname: `/shops/${record.id}` }}
            style={{
              color: "black",
              textDecoration: "none",
            }}
          >
            <Text strong>Date:</Text> {record.createdAt}
            <br />
            <Text strong>#:</Text> {record.id}
            <br />
            <Text strong>Name:</Text> {record.name}
            <br />
            <Text strong>Address:</Text> {record.address ?? "N/A"}
            <br />
            <Text strong>Code:</Text> {record.code}
          </Link>
        </div>
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
          danger
          icon={<DeleteOutlined />}
          onClick={(e) => {
            handleDeleteShop(e, record);
          }}
        />
      ),
      responsive: ["md", "lg", "xl", "xxl"],
    },
  ];
  return (
    <Card
      title="Shop List"
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
