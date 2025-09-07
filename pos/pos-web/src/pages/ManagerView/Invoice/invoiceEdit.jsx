import { Col, Row, Tag, Typography } from "antd";
import { useFirestore } from "reactfire";
import InvoiceService from "@/service/invoice.service";
import { error, success } from "@/utils/Utils/Utils";
import useAuthStore from "@/stores/auth.store";
import InvoiceForm from "@/components/Invoice/invoiceForm";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
const { Title, Text } = Typography;

const InvoiceEdit = ({ invoice, onResetMode }) => {
  const db = useFirestore();
  const invoiceService = new InvoiceService(db);
  const { userId } = useAuthStore();

  const handleSubmit = async (values) => {
    try {
      await invoiceService.update(invoice.id, values, invoice, userId);
      success(`Invoice is updated successfully`);
      onResetMode();
    } catch (err) {
      error("Fail to update invoice");
    }
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Invoice <span style={{ color: "#1890ff" }}>#{invoice.id}</span>{" "}
            <Tag color="orange">Edit Mode</Tag>
          </Title>
        </Col>
        <Col>
          <Text strong>Issue Date: </Text>
          <Text>{dayjs(invoice.createdAt).format(DATE_TIME_FORMAT)}</Text>
        </Col>
      </Row>

      <InvoiceForm
        onSubmit={handleSubmit}
        initialInvoiceData={invoice}
        onReset={() => onResetMode()}
      />
    </div>
  );
};

export default InvoiceEdit;
