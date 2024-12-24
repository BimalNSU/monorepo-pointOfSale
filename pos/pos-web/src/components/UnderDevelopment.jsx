import { Button, Typography, message, Divider, Row } from "antd";
import { DownOutlined, FilePdfOutlined, UploadOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

const UnderDevelopment = () => {
  return (
    <div className="addPadding-40">
      <div className={`border p-3 rounded`}>
        <Row style={{ width: "100%" }} align="center">
          <Title level={3}>This page is under development</Title>
        </Row>
      </div>
    </div>
  );
};
export default UnderDevelopment;
