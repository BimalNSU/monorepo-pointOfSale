import { useInvoice } from "@/api/useInvoice";
import { Button, Card, Col, Result, Row, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import InvoiceItemTableView from "./invoiceItemTableView";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import { convertToBD } from "@/constants/currency";
import PrintReceipt from "@/components/ReceiptPrint/printReceipt";
import Loading from "@/components/loading";
import { useMemo } from "react";

const { Title, Text } = Typography;

const InvoiceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { status, data: invoice } = useInvoice(id);
  const itemsDiscount = useMemo(
    () => invoice?.items.reduce((pre, curr) => pre + curr.discount || 0, 0) || 0,
    [invoice],
  );
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
          <Row gutter={[16, 10]} ustify="end">
            <Col span={24}>
              <Card
                title="Summary"
                styles={{
                  header: { padding: "6px 12px", fontSize: 14 },
                  body: { padding: "10px 12px" },
                }}
              >
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
                    {itemsDiscount ? (
                      <tr>
                        <td>
                          <Text strong>Item Discounts</Text>
                        </td>
                        <td>{":"}</td>
                        <td style={{ textAlign: "right" }}>{convertToBD(itemsDiscount)}</td>
                      </tr>
                    ) : null}
                    {invoice.specialDiscount ? (
                      <tr>
                        <td>
                          <Text strong>Special Discount</Text>
                        </td>
                        <td>{":"}</td>
                        <td style={{ textAlign: "right" }}>
                          {convertToBD(invoice.specialDiscount)}
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <td>
                        <Text strong>Total Invoice</Text>
                      </td>
                      <td>{":"}</td>
                      <td style={{ textAlign: "right" }}>{convertToBD(invoice.totalAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title="Payment"
                styles={{
                  header: { padding: "6px 12px", fontSize: 14 },
                  body: { padding: "10px 12px" },
                }}
              >
                <table>
                  <tbody>
                    {invoice.payments.map((p) => (
                      <tr key={p.accountId}>
                        <td>{p.name}</td>
                        <td>{`: ${convertToBD(p.amount)} TK.`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default InvoiceDetails;
