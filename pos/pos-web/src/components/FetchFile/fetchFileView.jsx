// import "./index.css";
import { Skeleton, Image, Card, Typography, Col, Row } from "antd";
import { useMemo } from "react";
import { useCustomStorageDownloadUrl } from "../../api/useCustomStorageDownloadUrl";
import { getFileExtension } from "@/api/common/commonFunctions";
import { FileOutlined } from "@ant-design/icons";
const imageExtensions = ["jpg", "JPG", "png", "PNG", "JPEG", "jpeg"];
const { Text } = Typography;
const FetchFileView = ({ storagePath }) => {
  const { status, data } = useCustomStorageDownloadUrl(storagePath);
  const fileType = useMemo(
    () => (storagePath ? getFileExtension(storagePath) : null),
    [storagePath],
  );
  if (!storagePath) {
    return (
      <Card
        size="small"
        style={{
          width: 130,
          backgroundColor: "#F5F5F5",
        }}
      >
        <Row justify="center">
          <Col>
            <FileOutlined style={{ fontSize: "30px", fontWeight: "50", color: "#bfbfbf" }} />
          </Col>
          <Col>
            <Text type="secondary">No Files Found</Text>
          </Col>
        </Row>
      </Card>
    );
  }
  if (imageExtensions.includes(fileType)) {
    if (status === "success" && data?.url) {
      return <Image width={130} preview={true} src={data?.url} />;
    }
    return <Skeleton.Image active={status === "loading" ? true : false} />;
  } else {
    if (status === "success" && data?.url) {
      return (
        <a href={data?.url} target="_blank" style={{ fontSize: 20 }}>
          <FileOutlined />
        </a>
      );
    }
    return (
      <Skeleton.Node active={status === "loading" ? true : false}>
        <FileOutlined />
      </Skeleton.Node>
    );
  }
};

export default FetchFileView;
