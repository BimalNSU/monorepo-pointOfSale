import { Table, Form, Button, InputNumber, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { convertToBD } from "@/constants/currency";
import { useEffect } from "react";
const { Text } = Typography;
const { Summary } = Table;

const InvoiceItemTable = ({ salesForm, dataSource, onChangeRow, onDeleteRow }) => {
  useEffect(() => {
    if (dataSource.length) {
      const quantiesInForm = dataSource.reduce(
        (pre, curr) => ({
          ...pre,
          [curr.key]: { qty: curr.qty, discount: curr.discount ?? undefined },
        }),
        {},
      );
      salesForm.setFieldsValue({ items: quantiesInForm });
    } else {
      salesForm.resetFields(["items"]);
    }
  }, [dataSource]);
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
      title: "Qty",
      dataIndex: "qty",
      render: (_, record) => (
        <Form.Item
          // noStyle
          name={["items", record.key, "qty"]}
          rules={[
            { required: true, message: "Qty is required" },
            {
              type: "number",
              min: 1,
              transform: (value) => Number(value),
              message: "Qty must be a number",
            },
          ]}
          style={{ margin: 0 }}
        >
          <InputNumber onChange={(value) => onChangeRow(value, "qty", record.key)} />
        </Form.Item>
      ),
    },
    {
      title: "Price",
      dataIndex: "rate",
      align: "right",
      render: (text) => convertToBD(text),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (_, record) => (
        <Form.Item
          name={["items", record.key, "discount"]}
          rules={[
            {
              type: "number",
              min: 0,
              // transform: (value) => Number(value),
              message: "Discount must be a positive number",
            },
          ]}
          style={{ margin: 0 }}
        >
          <InputNumber onChange={(value) => onChangeRow(value, "discount", record.key)} />
        </Form.Item>
      ),
    },
    {
      title: "Amount",
      align: "right",
      render: (_, record) => (
        <Text strong>
          {convertToBD((record.qty ?? 0) * (record.rate ?? 0) - (record.discount ?? 0))}
        </Text>
      ),
    },
    {
      title: "",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => onDeleteRow(record.key)}
          danger
          icon={<CloseOutlined />}
        />
      ),
    },
  ];

  return (
    <Table
      size="small"
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      // components={{
      //   body: {
      //     cell: ({ children, ...restProps }) => (
      //       <td {...restProps} style={{ padding: 0 }}>
      //         {children}
      //       </td>
      //     ),
      //   },
      // }}
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

export default InvoiceItemTable;
