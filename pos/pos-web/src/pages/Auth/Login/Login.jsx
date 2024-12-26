import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, useSigninCheck } from "reactfire";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Form, Input, Button, Checkbox, message, Typography, Space, Row } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { success, error } from "@/utils/Utils/Utils";
import "./Login.css";
import { apiProvider } from "@/utils/ApiProvider/ApiProvider";
import logo from "../../../images/logo.png";
import { useCustomAuth } from "@/utils/hooks/customAuth";

const { Title } = Typography;

// const key = 'updatable'

function Login() {
  // const auth = useAuth();
  const [isLoaded, setIsLoaded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithCustomToken, logout } = useCustomAuth();

  useEffect(() => {
    logout();
  }, []);

  const onFinish = async (values) => {
    setIsLoaded(false);
    const res = await apiProvider.login(values);
    try {
      if (res.status === 200) {
        const currentLoginType = res.data.currentLoginType;
        const userData = { ...res.data.userData, currentLoginType };
        // await login(res.data.accessToken,userData );
        await loginWithCustomToken(res.data.accessToken, userData);
        const { from } = location.state || { from: { pathname: "/" } };
        navigate(from, { replace: true });
      } else {
        error("Incorrect Email or password");
      }
    } catch (err) {
      error(err);
    }
    setIsLoaded(true);
  };
  return (
    <div className="addPadding-40">
      <Row type="flex" justify="center" align="middle">
        <div className="border p-3 rounded" style={{ backgroundColor: "#f4f4f4" }}>
          <div style={{ padding: "5%" }}>
            <Title level={2} align="center">
              <img src={logo} alt="logo" />
            </Title>
            <Title level={2}>Sign in with Email, Mobile or User ID</Title>
            <Title level={5}>
              Don&apos;t have an account? <Link to="/signup">Sign Up!!</Link>
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
                label="Email, Mobile Number or User ID:"
                name="loginWith"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email, Mobile or User ID!",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  type={"text"}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="email"
                />
              </Form.Item>
              <Form.Item
                label="Password:"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <br />
                <a className="login-form-forgot" href="/forgotpassword">
                  Forgot password
                </a>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={isLoaded ? false : true}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Row>
    </div>
  );
}
export default Login;
