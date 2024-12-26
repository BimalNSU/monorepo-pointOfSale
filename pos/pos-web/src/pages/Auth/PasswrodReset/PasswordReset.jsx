import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "reactfire";
import {
  getAuth,
  sendPasswordResetEmail,
  updatePassword,
  signInWithEmailAndPassword,
  logout,
} from "firebase/auth";
import { Form, Input, Button, Checkbox, Typography, Modal, Space, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { success, error } from "@/utils/Utils/Utils";
import logo from "../../../images/Property_icon.png";

const { Title } = Typography;

const { confirm } = Modal;

const showConfirmPersonalInfoForm = async (auth) => {
  confirm({
    title: "Are you sure to change password?",
    async onOk() {
      await auth.signOut();
      success(`Your password has been updated`);
    },
  });
};
const PasswordReset = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      await updatePassword(auth.currentUser, values.password);
      showConfirmPersonalInfoForm(auth);
    } catch (err) {
      error(`${err}`);
      await auth.signOut();
    }
    navigate("/");
  };
  return (
    <div className="reset">
      <div className="addPadding-40">
        <Row type="flex" justify="center" align="middle">
          <div className="border p-3 rounded" style={{ backgroundColor: "#f4f4f4" }}>
            <div style={{ padding: "100px" }}>
              <Title level={2} align="center">
                <img src={logo} width={"50%"} alt="logo" />
              </Title>
              <Title level={2}>Update Password</Title>
              <Form
                name="normal_login"
                layout="vertical"
                className="login-form"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
              >
                <Row justify="space-between" gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="cPassword"
                      label="Confirm Password"
                      dependencies={["password"]}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("The two passwords that you entered do not match!"),
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Update Password
                  </Button>
                  <br />
                  {/* Don't have an account? <Link to="/signup">Register</Link> now. */}
                </Form.Item>
              </Form>
            </div>
          </div>
        </Row>
      </div>
    </div>
  );
};
export default PasswordReset;
