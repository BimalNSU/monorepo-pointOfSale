import { useInvoice } from "@/api/useInvoice";
import { Button, Card, Col, Result, Row, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import InvoiceItemTableView from "./invoiceItemTableView";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import { convertToBD } from "@/constants/currency";
import PrintReceipt from "@/components/ReceiptPrint/printReceipt";
import Loading from "@/components/loading";

const { Title, Text } = Typography;

const InvoiceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { status, data: invoice } = useInvoice(id);
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
      <Row justify="center">
        <Title level={3}>Invoice Receipt</Title>
      </Row>
      <Row justify="space-between">
        <Col>
          <table>
            <tbody>
              <tr>
                <td>
                  <Text strong>Invoice#</Text>
                </td>
                <td>: {invoice.id}</td>
              </tr>
              <tr>
                <td>
                  <Text strong>Date</Text>
                </td>
                <td>: {dayjs(invoice.createdAt).format(DATE_TIME_FORMAT)}</td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col>
          <PrintReceipt invoice={invoice} />
        </Col>
      </Row>
      <Row gutter={[16, 2]}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <InvoiceItemTableView data={invoice.items} />
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card title="Summary & Payment">
            <table>
              <tbody>
                <tr>
                  <td>
                    <Text strong>Total Bill</Text>
                  </td>
                  <td>{":"}</td>
                  <td style={{ textAlign: "right" }}>
                    {convertToBD(
                      invoice.items.reduce((pre, curr) => pre + curr.qty * curr.rate, 0),
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Text strong>Total Discount</Text>
                  </td>
                  <td>{":"}</td>
                  <td style={{ textAlign: "right" }}>
                    {convertToBD(invoice.items.reduce((pre, curr) => pre + curr.discount ?? 0, 0))}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Text strong>Special Discount</Text>
                  </td>
                  <td>{":"}</td>
                  <td style={{ textAlign: "right" }}>
                    {invoice.specialDiscount && convertToBD(invoice.specialDiscount)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Text strong>Total Paid</Text>
                  </td>
                  <td>{":"}</td>
                  <td style={{ textAlign: "right" }}>{convertToBD(invoice.totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default InvoiceDetails;
