import { Card, Col, Row, Typography } from "antd";
import InvoiceItemTableView from "./invoiceItemTableView";
import { convertToBD } from "@/constants/currency";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import PrintReceipt from "@/components/ReceiptPrint/printReceipt";
import { useMemo } from "react";
const { Text } = Typography;
const InvoiceView = ({ invoice }) => {
  const calculatedData = useMemo(
    () =>
      invoice?.items.reduce(
        (pre, curr) => {
          pre.discountTotal += curr.discount || 0;
          pre.billTotal += curr.rate * curr.qty;
          return pre;
        },
        { discountTotal: 0, billTotal: 0 },
      ) || { discountTotal: 0, billTotal: 0 },
    [invoice],
  );
  return (
    <>
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
                        {convertToBD(calculatedData.billTotal)}
                      </td>
                    </tr>
                    {calculatedData.discountTotal ? (
                      <tr>
                        <td>
                          <Text strong>Item Discounts</Text>
                        </td>
                        <td>{":"}</td>
                        <td style={{ textAlign: "right" }}>
                          {convertToBD(calculatedData.discountTotal)}
                        </td>
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
    </>
  );
};
export default InvoiceView;
