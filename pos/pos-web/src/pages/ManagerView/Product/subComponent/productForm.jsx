import { Col, Form, Input, InputNumber, Row, Select, Typography } from "antd";
import * as validator from "@/utils/Validation/Validation";
import { useEffect } from "react";

const { Text } = Typography;
const { TextArea } = Input;
const categories = [{ id: "1", name: "Default" }];
const units = [
  { value: "pcs", label: "Pieces" },
  { value: "kg", label: "Kilograms" },
  { value: "g", label: "Grams" },
  { value: "l", label: "Liters" },
  { value: "ml", label: "Milliliters" },
  { value: "box", label: "Box" },
  { value: "set", label: "set" },
];

const ProductForm = ({ data, newProductFormat, form }) => {
  useEffect(() => {
    if (data) {
      const formData = {
        name: data.name,
        description: data.description,
        qty: data.qty || null,
        unit: data.unit || null,
        salesRate: data.salesRate,
        purchaseRate: data.purchaseRate || null,
      };
      form.setFieldsValue(formData);
    }
  }, [data]);

  return (
    <Row gutter={[16, 16]}>
      {/* Section 1: Basic Information */}
      <Col xs={24} sm={12}>
        <Form.Item label="Product ID" style={{ marginBottom: 16 }}>
          <Text strong>{data?.id || newProductFormat?.newProductId}</Text>
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: "Name is required" }]}
          style={{ marginBottom: 16 }}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          name="description"
          label="Description"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 24 }}
          rules={[{ whitespace: true, message: validator.BLANK_SPACE_MESSAGE }]}
        >
          <TextArea
            rows={3}
            showCount
            maxLength={500}
            placeholder="Product details, features, and specifications..."
          />
        </Form.Item>
      </Col>
      {/* Section 2: Pricing & Inventory */}
      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
        <Form.Item
          name="purchaseRate"
          label="Cost Price"
          // rules={[{ required: true, message: "Cost is required" }]}
        >
          <InputNumber addonAfter={"TK."} style={{ width: "100%" }} min={0} precision={2} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} lg={12} xl={12}>
        <Form.Item
          name="salesRate"
          label="Selling Price"
          rules={[{ required: true, message: "Price is required" }]}
        >
          <InputNumber addonAfter={"TK."} style={{ width: "100%" }} min={0} precision={2} />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12} lg={12} xl={12}>
        <Form.Item
          name="qty"
          label="Stock Quantity"
          rules={[{ required: true, message: "Quantity is required" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} precision={0} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} lg={12} xl={12}>
        <Form.Item
          name="unit"
          label="Unit of Measure"
          rules={[{ required: true, message: "Unit is required" }]}
        >
          <Select
            placeholder="Select unit"
            options={units.map((unit) => ({ value: unit.value, label: unit.label }))}
          />
        </Form.Item>
      </Col>

      {/* Section 3: Categorization */}
      <Col xs={24} sm={12} lg={12} xl={12}>
        <Form.Item
          name="category"
          label="Main Category"
          // rules={[{ required: true, message: "Category is required" }]}
        >
          <Select placeholder="Select category">
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
        <Form.Item name="subCategory" label="Subcategory">
          <Select placeholder="Select subcategory">{/* Dynamic options would go here */}</Select>
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
        <Form.Item name="brand" label="Brand">
          <Select placeholder="Select brand">{/* Brand options would go here */}</Select>
        </Form.Item>
      </Col>

      {/* Section 4: Additional Fields */}
      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
        <Form.Item name="sku" label="SKU Code">
          <Input placeholder="SKU-0001" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
        <Form.Item name="barcode" label="Barcode">
          <Input placeholder="Scan or enter barcode" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
        <Form.Item name="status" label="Status" initialValue="active">
          <Select>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
            <Select.Option value="discontinued">Discontinued</Select.Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default ProductForm;
