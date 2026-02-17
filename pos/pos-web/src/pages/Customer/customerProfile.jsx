import { useState } from "react";
import { Button, Card, Descriptions, Divider, Space, Row, Col, Result } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomer } from "@/api/useCustomer";
import CustomerForm from "./CustomerForm";
import Loading from "@/components/loading";
import { ClothType, PantFitType } from "@/constants/customer_cloth";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { status, data } = useCustomer(id);
  const [isEdit, setIsEdit] = useState(false);

  if (status === "loading") return <Loading />;
  if (status === "error") {
    return (
      <Result
        status="error"
        title="Invalid data"
        subTitle="Invalid data fetching error ...!"
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        }
      />
    );
  }
  if (!data) return <div>No customer found</div>;

  if (isEdit) {
    return <CustomerForm customerId={id} initialValues={data} onSuccess={() => setIsEdit(false)} />;
  }

  const items = [
    {
      key: "1",
      label: "Name",
      children: <span>{data.firstName}</span>,
    },
    {
      key: "2",
      label: "Mobile",
      children: <span>{data.mobile}</span>,
    },
    {
      key: "3",
      label: "Email",
      children: <span>{data.email || "N/A"}</span>,
    },
  ];
  return (
    <Card
      title="Customer Profile"
      extra={
        <Button type="primary" onClick={() => setIsEdit(true)}>
          Edit
        </Button>
      }
    >
      <Descriptions column={1} items={items} />

      <Divider>Cloths</Divider>

      <Space orientation="vertical" style={{ width: "100%" }}>
        <Row gutter={[16, 12]}>
          {data.cloths?.map((cloth, index) => (
            <Col key={index} xs={24} sm={24} md={24} lg={8} xl={8}>
              <Card size="small" title={ClothType.KEYS[cloth.type]}>
                {ClothType.VALUES.Pant === cloth.type && (
                  <div key={index}>
                    <p>
                      <span style={{ color: "#888" }}>{`Fit: `}</span>
                      {cloth.info.fit ? PantFitType[cloth.info.fit] : "N/A"}
                    </p>

                    <p>
                      <span style={{ color: "#888" }}>{`Waist: `}</span>
                      {cloth.info.waist}
                    </p>
                    <p>
                      <span style={{ color: "#888" }}>{`Side Length: `}</span>
                      {cloth.info.side_length}
                    </p>
                    <p>
                      <span style={{ color: "#888" }}>{`Front Rise: `}</span>
                      {cloth.info.front_rise}
                    </p>
                    <p>
                      <span style={{ color: "#888" }}>{`Thigh: `}</span>
                      {cloth.info.thigh}
                    </p>
                    <p>
                      <span style={{ color: "#888" }}>{`Leg Opening: `}</span>
                      {cloth.info.leg_opening}
                    </p>
                    <p>
                      <span style={{ color: "#888" }}>{`Remark: `}</span>
                      {cloth.info.remark ?? "N/A"}
                    </p>
                  </div>
                )}

                {[ClothType.VALUES.Shirt, ClothType.VALUES.PoloShirt].includes(cloth.type) && (
                  <div key={index}>
                    <p>
                      <span style={{ color: "#888" }}>{`Chest: `}</span>
                      {cloth.info.chest}
                    </p>
                    <p>
                      <span style={{ color: "#888" }}>{`Long: `}</span>
                      {cloth.info.long}
                    </p>
                    <p>
                      <span style={{ color: "#888" }}>{`Remark: `}</span>
                      {cloth.info.remark ?? "N/A"}
                    </p>
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Space>

      <p>
        <span style={{ color: "#888" }}>{`Added By: `}</span>
        {data.addedBy ?? "N/A"}
      </p>
    </Card>
  );
};

export default CustomerProfile;
