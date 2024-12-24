import { useInvoice } from "@/api/useInvoice";
import { Button, Card, Col, Result, Row, Spin, Typography } from "antd";
import { useHistory, useParams } from "react-router-dom";
import InvoiceItemTableView from "./invoiceItemTableView";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import { convertToBD } from "@/constants/currency";
import PrintReceipt from "@/components/ReceiptPrint/printReceipt";

const { Title, Text } = Typography;

const InvoiceView = () => {
  const history = useHistory();
  const { id } = useParams();
  const { status, data: invoice } = useInvoice(id);
  if (status === "loading") {
    return (
      <div style={{ position: "relative", minHeight: 200, padding: 20, border: "1px solid #ddd" }}>
        <Spin />
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
          <PrintReceipt data={invoice} />
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
                    <Text strong>Subtotal</Text>
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
                    {invoice.discount && convertToBD(invoice.discount)}
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
export default InvoiceView;
