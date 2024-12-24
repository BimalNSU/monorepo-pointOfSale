import { Table, Typography } from "antd";
import { convertToBD } from "@/constants/currency";
import { useMemo } from "react";
const { Text } = Typography;
const { Summary } = Table;

const InvoiceItemTableView = ({ data }) => {
  const invoiceItems = useMemo(
    () => data.map((invItem) => ({ ...invItem, key: invItem.productId })),
    [data],
  );
  const columns = [
    {
      title: "#",
      dataIndex: "productId",
      width: "20%",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Qty",
      dataIndex: "qty",
    },
    {
      title: "Price",
      dataIndex: "rate",
      render: (text) => convertToBD(text),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (text) => (text ? convertToBD(text) : text),
    },
    {
      title: "Total",
      align: "right",
      render: (_, record) => (
        <Text strong>
          {convertToBD((record.qty ?? 0) * (record.rate ?? 0) - (record.discount ?? 0))}
        </Text>
      ),
    },
  ];

  return (
    <Table
      size="small"
      dataSource={invoiceItems}
      columns={columns}
      pagination={false}
      summary={(currentData) => {
        const total = currentData.reduce(
          (sum, row) => sum + (row.qty || 0) * (row.rate || 0) - (row.discount || 0),
          0,
        );
        return (
          <Summary.Row>
            <Summary.Cell index={0}></Summary.Cell>
            <Summary.Cell index={1}></Summary.Cell>
            <Summary.Cell index={2}></Summary.Cell>
            <Summary.Cell index={3}></Summary.Cell>
            <Summary.Cell index={4}></Summary.Cell>
            <Summary.Cell index={5} align="right">
              <Text strong>Total</Text>
              {/* <b>Total</b> */}
            </Summary.Cell>
            <Summary.Cell index={6} align="right">
              {/* <Text>{totalAmount.toFixed(2)}</Text> */}
              <Text strong>{convertToBD(total)}</Text>
            </Summary.Cell>
          </Summary.Row>
        );
      }}
    />
  );
};

export default InvoiceItemTableView;
