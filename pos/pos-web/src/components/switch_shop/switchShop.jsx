import { Space, Row, Col } from "antd";
import SwitchableShop from "./subcomponents/switchableShops";

const SwitchShop = ({ shopRoles }) => {
  return (
    <Row>
      <Col>
        <Space direction="vertical">
          {Object.entries(shopRoles ?? {}).map(([shopId, shopRole]) => (
            <SwitchableShop key={shopId} shopId={shopId} shopRole={shopRole} />
          ))}
        </Space>
      </Col>
    </Row>
  );
};
export default SwitchShop;
