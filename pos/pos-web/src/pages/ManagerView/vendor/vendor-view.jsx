import { useVendor } from "@/api/vendor/useVendor";
import { useCustomProperty } from "@/utils/hooks/customProperty";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Result, Row, Spin, Typography } from "antd";
import { Link, useParams, useHistory } from "react-router-dom";
const { Text, Title } = Typography;

const VendorView = () => {
  const { id } = useParams();
  const { propertyId } = useCustomProperty();
  const history = useHistory();
  const { status, data } = useVendor(propertyId, id);

  if (status === "loading") {
    return (
      <div className={"spin"}>
        <Spin size="large" />
      </div>
    );
  }
  if (status === "error") {
    return (
      <Result
        status="error"
        title="Invalid data"
        subTitle="Invalid data fetching error ...!"
        extra={
          <Button type="primary" onClick={() => history.goBack()}>
            Go Back
          </Button>
        }
      />
    );
  }

  return (
    <div className="addPadding-10">
      <Button
        // className={styles.btn}
        type="secondary"
        // onClick={() => changeTab("2")}
        shape="circle"
        onClick={() => history.goBack()}
      >
        <ArrowLeftOutlined />
      </Button>
      <Card title={<Title level={5}>Vendor Info</Title>}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Text strong>ID:</Text>
            {data.id}
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Text strong>Mobile:</Text>
            {data.mobile}
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Text strong>Email:</Text>
            {data.email ?? "N/A"}
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Text strong>Address:</Text>
            {data.address ?? "N/A"}
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default VendorView;
