import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "reactfire";
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { Form, Input, Button, Checkbox, Typography, Modal, Space, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { success, error } from "@/utils/Utils/Utils";
import logo from "../../../images/Property_icon.png";

const { Title } = Typography;
const Reset = () => {
  const auth = useAuth();
  const history = useHistory();
  const onFinish = async (values) => {
    try {
      await sendPasswordResetEmail(auth, values.email);
      success(`A password reset link has been sent to ${(auth, values.email)}`);
      await auth.logout();
    } catch (err) {
      error(`A problem occured. Please try again! ${err}`);
    }
    history.push("/");
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
              <Title level={2}>Forgot Password?</Title>
              <Title level={5}>
                Please enter your email to reset your password <br />
                or Don&apos;t have an account?<Link to="/signup">Sign Up!!</Link>
                or Login <Link to="/">Login!</Link>
              </Title>

              <br />
              <br />
              <br />
              <Form
                name="normal_login"
                layout="vertical"
                className="login-form"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
              >
                <Form.Item
                  label="Email:"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Username!",
                    },
                  ]}
                >
                  <Input
                    style={{ width: "100%" }}
                    type={"email"}
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="email"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Send password reset email
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
export default Reset;
