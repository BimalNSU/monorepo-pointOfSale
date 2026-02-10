import { Button, Col, Form, Input, Modal, notification, Row } from "antd";
import { useState } from "react";
import * as validator from "@/utils/Validation/Validation";
const { Password } = Input;
const { confirm } = Modal;
const { success, error } = notification;

const UserPassword = ({ onUpdate, isAdmin }) => {
  const [isEditing, setIsEditing] = useState();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    confirm({
      title: "Are you sure to update password?",
      async onOk() {
        try {
          await onUpdate({
            ...(!isAdmin && { currentPassword: values.currentPassword }),
            newPassword: values.newPassword,
          });
          success({
            message: "Password is changed successfully",
            // description: "Welcome back!",
            placement: "topRight",
            duration: 2,
          });
          setIsEditing(false);
        } catch (e) {
          error({
            message: e.message ?? "Fail to change password",
            placement: "topRight",
            duration: 2,
          });
        } finally {
          form.resetFields();
        }
      },
      content: `This will immediately terminate all sessions for this user, logging them out from all devices${
        !isAdmin ? ` except current one` : ""
      }`,
    });
  };
  return (
    <div style={{ marginTop: 8 }}>
      {!isEditing ? (
        <Button onClick={() => setIsEditing(true)}> Change Password</Button>
      ) : (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={[16, 0]}>
            {!isAdmin && (
              <Col xs={24} sm={24} md={24}>
                <Form.Item
                  name="currentPassword"
                  label="Current Password"
                  rules={[
                    { required: true, message: "Please input current password!" },
                    { whitespace: true, message: validator.BLANK_SPACE_MESSAGE },
                  ]}
                >
                  <Password placeholder="Current password" />
                </Form.Item>
              </Col>
            )}
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: "Please input new password!" },
                  { whitespace: true, message: validator.BLANK_SPACE_MESSAGE },
                ]}
              >
                <Password placeholder="New password" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match!"));
                    },
                  }),
                ]}
              >
                <Password placeholder="Confirm password" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 8 }}>
            <Row justify="end" gutter={12}>
              <Col xs={12}>
                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
              </Col>
              <Col xs={12}>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};
export default UserPassword;
