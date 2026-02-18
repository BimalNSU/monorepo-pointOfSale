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
const { TextArea } = Input;
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
      const { id, ...rest } = initialValues;
      form.setFieldsValue({
        ...rest,
        cloths: rest.cloths || [],
      });
    }
  }, [initialValues, form]);

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
      form.resetFields();
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
    form.resetFields();
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
          <Col xs={24} lg={24}>
            <Form.Item
              name="firstName"
              label="Name"
              rules={[
                { required: true, message: `Please enter customer's name!` },
                {
                  whitespace: true,
                  message: validator.BLANK_SPACE_MESSAGE,
                },
                {
                  min: validator.MIN_CHARACTER,
                  message: `Customer Name ${validator.MIN_CHARACTER_MESSAGE}`,
                },
                {
                  max: validator.MAX_CHARACTER,
                  message: `Customer Name ${validator.MAX_CHARACTER_MESSAGE}`,
                },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: "Name can only contain letters and spaces",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          {/* <Col xs={24} lg={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                {
                  whitespace: true,
                  message: validator.BLANK_SPACE_MESSAGE,
                },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: validator.SPECIAL_CHARACTER_MESSAGE,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col> */}

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
              <Row gutter={[12, 12]}>
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
                                <Form.Item
                                  name={[name, "info", "fit"]}
                                  label="Fit"
                                  rules={[{ required: true, message: "Please select a fit" }]}
                                >
                                  <Select
                                    placeholder="Select Pant Fit"
                                    options={[
                                      { label: "Slim", value: "slim" },
                                      { label: "Regular", value: "regular" },
                                      { label: "Bootcut", value: "bootcut" },
                                      { label: "Baggy", value: "baggy" },
                                    ]}
                                  />
                                </Form.Item>
                                <Form.Item
                                  name={[name, "info", "waist"]}
                                  label="Waist"
                                  rules={[{ required: true, message: "Please enter waist" }]}
                                >
                                  <InputNumber style={{ minWidth: "100%" }} />
                                </Form.Item>

                                <Form.Item
                                  name={[name, "info", "side_length"]}
                                  label="Side Length"
                                  rules={[{ required: true, message: "Please enter side length" }]}
                                >
                                  <InputNumber style={{ minWidth: "100%" }} />
                                </Form.Item>

                                <Form.Item
                                  name={[name, "info", "front_rise"]}
                                  label="Front Rise"
                                  rules={[{ required: true, message: "Please enter front rise" }]}
                                >
                                  <InputNumber style={{ minWidth: "100%" }} />
                                </Form.Item>

                                <Form.Item
                                  name={[name, "info", "thigh"]}
                                  label="Thigh"
                                  rules={[{ required: true, message: "Please enter thigh" }]}
                                >
                                  <InputNumber style={{ minWidth: "100%" }} />
                                </Form.Item>

                                <Form.Item
                                  name={[name, "info", "leg_opening"]}
                                  label="Leg Opening"
                                  rules={[{ required: true, message: "Please enter leg-opening" }]}
                                >
                                  <InputNumber style={{ minWidth: "100%" }} />
                                </Form.Item>

                                <Form.Item
                                  name={[name, "info", "remark"]}
                                  label="Remark"
                                  rules={[
                                    {
                                      whitespace: true,
                                      message: validator.BLANK_SPACE_MESSAGE,
                                    },
                                    {
                                      pattern: new RegExp(/[a-zA-Z]/),
                                      message: validator.SPECIAL_CHARACTER_MESSAGE,
                                    },
                                  ]}
                                >
                                  <TextArea
                                    autoSize={{ minRows: 2 }}
                                    placeholder="Optional remark"
                                  />
                                </Form.Item>
                              </>
                            );
                          }

                          if (type === "shirt" || type === "polo_shirt") {
                            return (
                              <>
                                <Form.Item
                                  name={[name, "info", "chest"]}
                                  label="Chest"
                                  rules={[{ required: true, message: "Please enter chest" }]}
                                >
                                  <InputNumber style={{ minWidth: "100%" }} />
                                </Form.Item>

                                <Form.Item
                                  name={[name, "info", "long"]}
                                  label="Length"
                                  rules={[{ required: true, message: "Please enter long" }]}
                                >
                                  <InputNumber style={{ minWidth: "100%" }} />
                                </Form.Item>
                                <Form.Item
                                  name={[name, "info", "remark"]}
                                  label="Remark"
                                  rules={[
                                    {
                                      whitespace: true,
                                      message: validator.BLANK_SPACE_MESSAGE,
                                    },
                                    {
                                      pattern: new RegExp(/[a-zA-Z]/),
                                      message: validator.SPECIAL_CHARACTER_MESSAGE,
                                    },
                                  ]}
                                >
                                  <TextArea rows={2} placeholder="Optional remark" />
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
        <Row gutter={[16, 10]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="addedBy"
              label="Added By"
              rules={[
                { required: true, message: `Please enter 'added by' name!` },
                {
                  whitespace: true,
                  message: validator.BLANK_SPACE_MESSAGE,
                },
                {
                  min: validator.MIN_CHARACTER,
                  message: `Added By ${validator.MIN_CHARACTER_MESSAGE}`,
                },
                {
                  max: validator.MAX_CHARACTER,
                  message: `Added By ${validator.MAX_CHARACTER_MESSAGE}`,
                },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: validator.SPECIAL_CHARACTER_MESSAGE,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
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
