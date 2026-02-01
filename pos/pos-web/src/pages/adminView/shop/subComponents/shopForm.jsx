import { Form, Input, Button, Typography, Card, Space, Spin } from "antd";
const { Title, Text } = Typography;

const ShopForm = ({ mode, initialValues, onSubmit, onCancel, newShopFormat }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values, form);
  };

  return (
    // <Card style={{ maxWidth: 600, margin: "0 auto" }}>
    <>
      <Title level={4} style={{ textAlign: "center" }}>
        {mode === "edit" ? "Edit Shop" : "Add Shop"}
      </Title>

      <Form layout="vertical" form={form} initialValues={initialValues} onFinish={handleFinish}>
        {/* <>
          <Text>{`Shop ID: `}</Text>
          {newShopFormat?.status === "loading" ? <Spin size="small"></Spin> : null}
          {initialValues?.id || newShopFormat?.newShopId ? (
            <Text strong> {initialValues?.id || newShopFormat?.newShopId}</Text>
          ) : null}
        </>
        <br />
        <br /> */}
        {/* </Col> */}
        <Form.Item
          label="Shop Name"
          name="name"
          rules={[{ required: true, message: "Please enter shop name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: true, message: "Please enter shop code" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {mode === "edit" ? "Update" : "Create"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default ShopForm;
