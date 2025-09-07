import { Table, Form, Button, InputNumber, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { convertToBD } from "@/constants/currency";
import { useEffect } from "react";
const { Text } = Typography;
const { Summary } = Table;

const InvoiceItemTable = ({ form, invoiceItems, onChangeRow, onDeleteRow, isEditing }) => {
  useEffect(() => {
    if (invoiceItems.length) {
      const formValues = Object.fromEntries(
        invoiceItems.map((item) => [
          item.productId,
          { qty: item.qty, discount: item.discount ?? undefined },
        ]),
      );
      form.setFieldsValue({ items: formValues });
    } else {
      form.resetFields(["items"]);
    }
  }, [invoiceItems]);

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
          name={["items", record.key, "qty"]} // dummy field just for validation
          rules={[
            { required: true, message: "Qty is required" },
            { type: "number", min: 1, message: "Qty must be at least 1" },
          ]}
          style={{ margin: 0 }}
        >
          <InputNumber onChange={(val) => onChangeRow(val, "qty", record.productId)} />
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
      render: (discount, record) => (
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
          <InputNumber onChange={(value) => onChangeRow(value, "discount", record.productId)} />
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
      render: (_, record) =>
        !isEditing || (isEditing && invoiceItems.length > 1) ? (
          <Button
            type="link"
            onClick={() => onDeleteRow(record.key)}
            danger
            icon={<CloseOutlined />}
          />
        ) : null,
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
          (sum, row) => sum + (row.qty || 0) * row.rate - (row.discount || 0),
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
