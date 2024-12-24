import { useCustomStorageDownloadUrl } from "@/api/useCustomStorageDownloadUrl";
import { UserOutlined } from "@ant-design/icons";
import { Card, Col, Image, Row, Skeleton, Typography } from "antd";
const { Text } = Typography;
export const FetchProfileImage = ({ storagePath }) => {
  const { status, data } = useCustomStorageDownloadUrl(storagePath);
  if (!storagePath) {
    return (
      <Card
        size="small"
        style={{
          width: 100,
          backgroundColor: "#F5F5F5",
        }}
      >
        <Row justify="center">
          <Col>
            <UserOutlined style={{ fontSize: "30px", fontWeight: "50", color: "#bfbfbf" }} />
          </Col>
          <Col>
            <Text type="secondary">No Images</Text>
          </Col>
        </Row>
      </Card>
    );
  }
  if (status === "success" && data?.url) {
    return <Image width={100} preview={true} src={data.url} />;
  }
  return (
    <Skeleton.Node active={status === "loading" ? true : false} shape="square" size={100}>
      <UserOutlined style={{ fontSize: 35, color: "#bfbfbf" }} />
    </Skeleton.Node>
  );
};
