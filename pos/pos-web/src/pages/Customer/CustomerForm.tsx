import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Space,
  Divider,
  notification,
  Col,
  Row,
  InputNumber,
  Typography,
} from "antd";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import CustomerService from "@/service/customer.service";
import { useFirestore } from "reactfire";
import { Customer, WithId } from "@pos/shared-models";
import * as validator from "../../utils/Validation/Validation";
const { Title, Text } = Typography;
interface Props {
  initialValues?: WithId<Customer>;
  customerId: string;
  onSuccess?: () => void;
}

const CLOTH_OPTIONS = [
  { label: "Pant", value: "pant" },
  { label: "Shirt", value: "shirt" },
  { label: "Polo Shirt", value: "polo_shirt" },
];

const CustomerForm: React.FC<Props> = ({ initialValues, customerId, onSuccess }) => {
  const [form] = Form.useForm();
  const db = useFirestore();
  const { userId: authUserId } = useFirebaseAuth();
  const customerService = new CustomerService(db);

  useEffect(() => {
    if (initialValues) {
      form.resetFields();
      const { id, ...rest } = initialValues;

      form.setFieldsValue({
        ...rest,
        cloths: rest.cloths || [],
      });
    }
  }, [initialValues, form]);

  // -----------------------------
  // Get already selected cloth types
  // -----------------------------
  const getSelectedClothTypes = () => {
    const cloths = form.getFieldValue("cloths") || [];
    return cloths.map((c: any) => c?.type).filter(Boolean);
  };

  const onFinish = async (values: Customer) => {
    try {
      if (!authUserId) {
        notification.error({ message: "Unauthorized user" });
        return;
      }

      if (initialValues) {
        await customerService.update(customerId, values, authUserId);
        notification.success({
          message: "Customer updated successfully",
          duration: 2,
        });
      } else {
        await customerService.add({ ...values, id: customerId }, authUserId);
        notification.success({
          message: "Customer added successfully",
          duration: 2,
        });
      }

      onSuccess?.();
    } catch (error) {
      notification.error({
        message: `Failed to ${initialValues ? "update" : "add"} customer`,
        duration: 2,
      });
    }
  };
  const handleReset = () => {
    form.resetFields();
  };

  const handleCancel = () => {
    form.setFieldsValue({
      ...initialValues,
      cloths: initialValues?.cloths || [],
    });
    onSuccess?.();
  };

  return (
    <Card title={initialValues ? "Update Customer" : "Add Customer"}>
      <Row justify="start" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Title level={5} style={{ margin: 0 }}>
              Customer ID:
            </Title>
            <Text strong style={{ fontSize: 16 }}>
              #{customerId}
            </Text>
          </Space>
        </Col>
      </Row>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ flex: "120px" }}
        wrapperCol={{ flex: 1 }}
        labelAlign="left"
        labelWrap
        onFinish={onFinish}
      >
        <Divider>Basic Information</Divider>

        <Row gutter={[16, 10]}>
          <Col xs={24} lg={12}>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item name="lastName" label="Last Name">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item
              name="mobile"
              label="Mobile"
              rules={[
                {
                  required: true,
                  message: `Please enter customer's Mobile No!`,
                },
                {
                  pattern: new RegExp(/^01[3-9]\d{8}$/),
                  message: `Please enter customer's valid mobile number`,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: "email",
                  message: validator.VALID_EMAIL_MESSAGE,
                },
                {
                  whitespace: true,
                  message: validator.BLANK_SPACE_MESSAGE,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Measurements</Divider>
        <Form.List
          name="cloths"
          rules={[
            {
              validator: async (_, cloths) => {
                if (!cloths) return;

                const types = cloths.map((c: any) => c?.type).filter(Boolean);

                const uniqueTypes = new Set(types);

                if (types.length !== uniqueTypes.size) {
                  return Promise.reject(new Error("Duplicate cloth type is not allowed"));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              <Row gutter={[16, 16]}>
                {fields.map(({ key, name }) => (
                  <Col xs={24} lg={12} key={key}>
                    <Card size="small">
                      <Form.Item
                        name={[name, "type"]}
                        label="Cloth Type"
                        rules={[{ required: true }]}
                      >
                        <Select
                          placeholder="Select cloth type"
                          options={CLOTH_OPTIONS.map((option) => ({
                            ...option,
                            disabled:
                              getSelectedClothTypes().includes(option.value) &&
                              option.value !== form.getFieldValue(["cloths", name, "type"]),
                          }))}
                        />
                      </Form.Item>

                      {/* Conditional measurement fields */}
                      <Form.Item shouldUpdate noStyle>
                        {({ getFieldValue }) => {
                          const type = getFieldValue(["cloths", name, "type"]);

                          if (type === "pant") {
                            return (
                              <>
                                <Form.Item name={[name, "info", "waist"]} label="Waist">
                                  <InputNumber style={{ width: "100%" }} />
                                </Form.Item>

                                <Form.Item name={[name, "info", "side_length"]} label="Side Length">
                                  <InputNumber style={{ width: "100%" }} />
                                </Form.Item>

                                <Form.Item name={[name, "info", "front_rise"]} label="Front Rise">
                                  <InputNumber style={{ width: "100%" }} />
                                </Form.Item>

                                <Form.Item name={[name, "info", "thight"]} label="Thigh">
                                  <InputNumber style={{ width: "100%" }} />
                                </Form.Item>

                                <Form.Item name={[name, "info", "leg_opening"]} label="Leg Opening">
                                  <InputNumber style={{ width: "100%" }} />
                                </Form.Item>
                              </>
                            );
                          }

                          if (type === "shirt" || type === "polo_shirt") {
                            return (
                              <>
                                <Form.Item name={[name, "info", "chest"]} label="Chest">
                                  <InputNumber style={{ width: "100%" }} />
                                </Form.Item>

                                <Form.Item name={[name, "info", "long"]} label="Length">
                                  <InputNumber style={{ width: "100%" }} />
                                </Form.Item>
                              </>
                            );
                          }

                          return null;
                        }}
                      </Form.Item>

                      <div style={{ textAlign: "right" }}>
                        <Button danger size="small" onClick={() => remove(name)}>
                          Remove
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Add Cloth Button */}
              <Form.Item style={{ marginTop: 20 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  disabled={(form.getFieldValue("cloths") || []).length >= 3}
                >
                  + Add Cloth
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Action Buttons */}
        <Form.Item style={{ marginTop: 20 }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            {/* ADD MODE */}
            {!initialValues && (
              <>
                <Button onClick={handleReset}>Reset</Button>
                <Button type="primary" htmlType="submit">
                  Add Customer
                </Button>
              </>
            )}

            {/* UPDATE MODE */}
            {initialValues && (
              <>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Update Customer
                </Button>
              </>
            )}
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CustomerForm;
