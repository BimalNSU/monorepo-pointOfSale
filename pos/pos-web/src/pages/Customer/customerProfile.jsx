import { useState } from "react";
import { Button, Card, Descriptions, Divider, Tag, Space, Row, Col } from "antd";
import { useParams } from "react-router-dom";
import { useCustomer } from "@/api/useCustomer";
import CustomerForm from "./CustomerForm";
import Loading from "@/components/loading";

const CustomerProfile = () => {
  const { id } = useParams();
  const { status, data } = useCustomer(id);
  const [isEdit, setIsEdit] = useState(false);

  if (status === "loading") return <Loading />;
  if (!data) return <div>No customer found</div>;

  if (isEdit) {
    return <CustomerForm customerId={id} initialValues={data} onSuccess={() => setIsEdit(false)} />;
  }

  return (
    <Card
      title="Customer Profile"
      extra={
        <Button type="primary" onClick={() => setIsEdit(true)}>
          Edit
        </Button>
      }
    >
      <Descriptions column={1} variant>
        <Descriptions.Item label="First Name">{data.firstName}</Descriptions.Item>

        <Descriptions.Item label="Last Name">{data.lastName || "-"}</Descriptions.Item>

        <Descriptions.Item label="Email">{data.email || "-"}</Descriptions.Item>

        <Descriptions.Item label="Mobile">{data.mobile}</Descriptions.Item>
      </Descriptions>

      <Divider>Cloths</Divider>

      <Space orientation="vertical" style={{ width: "100%" }}>
        <Row gutter={[16, 12]}>
          {data.cloths?.map((cloth, index) => (
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Card key={index} size="small">
                <Tag color="blue">{cloth.type.toUpperCase()}</Tag>

                <Divider />

                {Object.entries(cloth.info).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key.replace("_", " ")}:</strong> {value}
                  </p>
                ))}
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </Card>
  );
};

export default CustomerProfile;
