import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, Typography, Input, message } from "antd";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import { apiProvider } from "@/utils/ApiProvider/ApiProvider";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Title } = Typography;

function UserSettingsChangePassword() {
  const [form] = Form.useForm();
  const user = useCustomAuth();
  const history = useHistory();

  // handlers
  const onFinish = async (values) => {
    const { currentPassword, newPassword } = values;
    const token = await user.getToken();
    const res = await apiProvider.changePassword(token, currentPassword, newPassword);
    if (res.status === 200) {
      message.success("Password changed successfully.");
      history.push("/settings");
    }
  };

  return (
    <div style={{ paddingInline: "3rem" }}>
      <Button shape="circle" onClick={() => history.goBack()} style={{ fontSize: 15 }}>
        <ArrowLeftOutlined />
      </Button>
      <Title level={4}>Change Password</Title>
      <hr />
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
        labelAlign="left"
      >
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[{ required: true, message: "Please input your current password." }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[{ required: true, message: "Please input your new password." }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPasswordConfirm"
          label="Confirm New Password"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your new password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Does not match with new password!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <div style={{ marginBlock: "2rem" }}>
          <Button htmlType="submit" type="primary" style={{ marginRight: "1rem" }}>
            Save
          </Button>
          <Link to="/settings">
            <Button>Cancel</Button>
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default UserSettingsChangePassword;
