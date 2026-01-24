import { useRef, useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "reactfire";
import { Form, Input, Button, Checkbox, Typography, Row, Col, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Login.css";
import logo from "../../../images/logo.png";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
const { Title } = Typography;
const { Password } = Input;

const LoginForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, session } = useFirebaseAuth();

  const onFinish = async (values) => {
    if (!executeRecaptcha) return;
    setLoading(true);
    try {
      const reCaptchaToken = await executeRecaptcha("login");
      await login(values, reCaptchaToken);
      const { from } = location.state || { from: { pathname: "/dashboard" } };
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message ?? "Login credentials do not match.");
    } finally {
      setLoading(false);
    }
  };

  if (session?.id) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="addPadding-40">
      <Row justify="center" align="middle">
        <Col xs={24} sm={18} md={12} lg={8}>
          <div className="border p-3 rounded" style={{ backgroundColor: "#f4f4f4" }}>
            <div style={{ padding: "5%" }}>
              <Title level={2} style={{ textAlign: "center" }}>
                <img src={logo} alt="logo" style={{ maxWidth: 150 }} />
              </Title>

              {formError && (
                <Alert message={formError} type="error" showIcon style={{ marginBottom: 16 }} />
              )}

              <Form
                name="login_form"
                layout="vertical"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
              >
                <Form.Item
                  label="User ID / Mobile Number / Email"
                  name="loginWith"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your User ID, Mobile Number, or Email",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Enter User ID / Mobile / Email"
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password",
                    },
                  ]}
                >
                  <Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                </Form.Item>

                <Form.Item>
                  <Checkbox name="remember">Remember me</Checkbox>
                  <div style={{ float: "right" }}>
                    <Link to="/forgotpassword">Forgot password?</Link>
                  </div>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block loading={loading}>
                    Log in
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
const Login = () => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      <LoginForm />
    </GoogleReCaptchaProvider>
  );
};

export default Login;
