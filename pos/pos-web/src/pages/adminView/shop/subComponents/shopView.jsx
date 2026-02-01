import { EditOutlined } from "@ant-design/icons";
import { Card, Descriptions, Button, Typography } from "antd";
const { Title } = Typography;

const ShopView = ({ shop, onEdit }) => {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={4}>Shop Information</Title>
        <Button onClick={onEdit} type="text">
          <EditOutlined />
        </Button>
      </div>

      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="Shop Name">{shop.name}</Descriptions.Item>
        <Descriptions.Item label="Address">{shop.address || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Code">{shop.code}</Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default ShopView;
