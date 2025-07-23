import UserService from "@/service/user.service";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { useState } from "react";
import { useFirestore } from "reactfire";
import * as validator from "@/utils/Validation/Validation";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
const { Password } = Input;
const { confirm } = Modal;

const UserPassword = ({ userId }) => {
  const { session, getToken } = useFirebaseAuth();
  const [isEditing, setIsEditing] = useState();
  const [form] = Form.useForm();
  const db = useFirestore();
  const userService = new UserService(db);

  const onFinish = (values) => {
    confirm({
      title: "Are you sure to update password?",
      async onOk() {
        try {
          const idToken = await getToken();
          const res = await userService.updateByAdmin(
            userId,
            { password: values.password },
            idToken,
            session.id,
          );
          if (res.status === 200) {
            message.success("Password is changed successfully");
            form.resetFields();
            setIsEditing(false);
          } else {
            throw new Error("Fail to change password");
          }
        } catch (e) {
          message.error(e.message);
        }
      },
    });
  };
  return (
    <div style={{ marginTop: 8 }}>
      {!isEditing ? (
        <Button onClick={() => setIsEditing(true)}> Change Password</Button>
      ) : (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={[10, 8]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: `Please input your password!` },
                  { whitespace: true, message: validator.BLANK_SPACE_MESSAGE },
                ]}
              >
                <Password placeholder="input password" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                rules={[
                  { required: true, message: `Please confirm your password!` },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match!"));
                    },
                  }),
                ]}
              >
                <Password placeholder="input password" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Row gutter={[16, 10]} justify="center" align="middle">
              {/* <Space>{children}</Space> */}
              <Col>
                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
              </Col>
              <Col>
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
