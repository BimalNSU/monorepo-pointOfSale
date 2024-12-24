import { USER_ROLE } from "@/constants/role";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import { Button, Col, Form, Input, InputNumber, Row, Spin, Typography } from "antd";
import { useEffect } from "react";
import * as validator from "@/utils/Validation/Validation";
const { Text } = Typography;

const ProductAddEdit = ({ data, onSubmit, newProductFormat }) => {
  const { role } = useCustomAuth();
  const [productForm] = Form.useForm();

  useEffect(() => {
    if (data) {
      productForm.setFieldsValue({
        name: data.name,
        description: data.description,
        qty: data.qty,
        salesRate: data.salesRate,
        ...([USER_ROLE.VALUES.Admin, USER_ROLE.VALUES.Manager].includes(role) && data.purchaseRate
          ? { purchaseRate: data.purchaseRate }
          : {}),
      });
    }
  }, [data]);
  const onFinish = (values) => {
    const { categoryId, qty, ...rest } = values;
    onSubmit(role === USER_ROLE.VALUES.Admin ? values : rest, productForm);
  };

  return (
    <Form onFinish={onFinish} form={productForm}>
      <Row gutter={[16, 1]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Form.Item name="categoryId" label="Category">
            <Input placeholder="Enter product name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item label="Product ID">
            <>
              {newProductFormat?.status === "loading" ? <Spin size="small"></Spin> : null}
              {data?.id || newProductFormat?.newProductId ? (
                <Text strong> {data?.id || newProductFormat?.newProductId}</Text>
              ) : null}
            </>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input product name" },
              { whitespace: true, message: validator.BLANK_SPACE_MESSAGE },
            ]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ whitespace: true, message: validator.BLANK_SPACE_MESSAGE }]}
          >
            <Input placeholder="Enter product description" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={4} xl={4}>
          {role === USER_ROLE.VALUES.Admin ? (
            <Form.Item
              name="qty"
              label="Qty"
              rules={[
                { required: true, message: "Please input product qty" },
                { type: "number", min: 1, message: "Qty must be a positive number" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Enter product qty" />
            </Form.Item>
          ) : (
            <Text strong>Qty: {data?.qty || 0}</Text>
          )}
        </Col>
        <Col xs={24} sm={24} md={24} lg={10} xl={10}>
          <Form.Item
            name="purchaseRate"
            label="Purchase Rate"
            rules={[{ type: "number", min: 1, message: "Purchase rate must be a positive number" }]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Enter product's purchase rate" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={10} xl={10}>
          <Form.Item
            name="salesRate"
            label="Sales Rate"
            rules={[
              { required: true, message: "Please input sales rate" },
              { type: "number", min: 1, message: "Sales rate must be a positive number" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Enter product's sales rate" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {data ? "Edit" : "Add"}
        </Button>
      </Form.Item>
    </Form>
  );
};
export default ProductAddEdit;
