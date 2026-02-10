import { useInvoice } from "@/api/useInvoice";
import { Button, Result, Row, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/loading";
import { useState } from "react";
import InvoiceEdit from "../invoiceEdit";
import { EditOutlined } from "@ant-design/icons";
import InvoiceView from "./invoiceView";
import { USER_ROLE } from "@pos/shared-models";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";

const { Title, Text } = Typography;

const InvoiceDetails = () => {
  const { session } = useFirebaseAuth();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { status, data: invoice } = useInvoice(id);
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  if (status === "loading") {
    return <Loading />;
  }
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
  return (
    <div>
      <Row gutter={[16, 1]} justify="center">
        <Title level={3} style={{ margin: 0, marginRight: "15px" }}>
          Invoice Receipt
        </Title>
        {session.role === USER_ROLE.VALUES.Admin && !isEditing && (
          <Button onClick={handleEdit} type="primary" icon={<EditOutlined />}>
            Edit
          </Button>
        )}
      </Row>

      {!isEditing ? (
        <InvoiceView invoice={invoice} />
      ) : (
        <InvoiceEdit invoice={invoice} onResetMode={handleCancel} />
      )}
    </div>
  );
};
export default InvoiceDetails;
