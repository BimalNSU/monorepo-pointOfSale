import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore, useStorage } from "reactfire";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Radio,
  Row,
  Select,
  Switch,
  Tag,
  Typography,
} from "antd";
import UserService from "@/service/user.service";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import ImageUploadWithPreview from "@/components/FIleUpload/ImageUploadWithPreview";
import * as validator from "../../../utils/Validation/Validation";
import { DOB_dateFormat } from "@/constants/dateFormat";
import { USER_ROLE } from "@pos/shared-models";
import { MARITAL_TYPE, RELIGION_TYPE } from "@/constants/common";
const { Option } = Select;
const { Title, Text } = Typography;
const { Password } = Input;
const bloodGroupsData = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const UserAdd = () => {
  const { getToken, session } = useFirebaseAuth();
  const navigate = useNavigate();
  const db = useFirestore();
  const storage = useStorage();
  const [personalInfoForm] = Form.useForm();
  const userService = new UserService(db);

  const handleSubmit = async (values) => {
    try {
      const personalInfo = {
        role: values.role ?? USER_ROLE.VALUES.Employee,
        profileImage: values.profileImage,
        firstName: values.firstName,
        lastName: values.lastName || null,
        mobile: values.mobile,
        email: values.email || null,
        DOB: values.DOB.startOf("day").toDate(),
        bloodGroup: values.bloodGroup || null,
        gender: values.gender,
        religion: values.religion || null,
        maritalStatus: values.maritalStatus || null,
        occupation: values.occupation || null,
        password: values.password,
      };
      const idToken = await getToken();
      const res = await userService.add(personalInfo, idToken, session.id);
      if (res.status === 201) {
        personalInfoForm.resetFields();
        notification.success({ message: "New user added successfully", duration: 2 });
      } else {
        personalInfoForm.setFields(
          Object.entries(res.data.errors).map(([field, errors]) => ({
            name: field,
            errors,
          })),
        );
        notification.error({ message: "Fail to add", duration: 2 });
      }
    } catch (err) {
      notification.error({ message: err.message ?? "error", duration: 2 });
    }
  };
  return (
    <Card
      title="Add User"
      variant="borderless"
      style={{
        // width: 300,
        margin: "10px",
      }}
    >
      <Form
        form={personalInfoForm}
        name="register"
        onFinish={handleSubmit}
        layout="horizontal"
        scrollToFirstError
        labelCol={{ flex: "140px" }}
        labelAlign="left"
        labelWrap
        // onFinishFailed={onFinishFailed}
        wrapperCol={{ flex: 1 }}
        colon={true}
      >
        <Row justify="space-between">
          <Col>
            <Title level={3}>Personal Info.</Title>
          </Col>
          <Col>
            <ImageUploadWithPreview name="profileImage" />
          </Col>
        </Row>
        <Row gutter={[16, 10]} justify="space-between">
          {session.role === USER_ROLE.VALUES.Admin && (
            <>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                  <Select
                    style={{ width: 120 }}
                    options={Object.entries(USER_ROLE.KEYS).map(([roleId, text]) => ({
                      value: roleId,
                      label: text,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  name="isActive"
                  label="Status"
                  valuePropName="checked"
                  rules={[{ required: true }]}
                >
                  <Switch />
                </Form.Item>
              </Col>
            </>
          )}
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                {
                  required: true,
                  message: `Please enter user's First Name!`,
                },
                {
                  whitespace: true,
                  message: validator.BLANK_SPACE_MESSAGE,
                },
                {
                  min: validator.MIN_CHARACTER,
                  message: `First Name ${validator.MIN_CHARACTER_MESSAGE}`,
                },
                {
                  max: validator.MAX_CHARACTER,
                  message: `First Name ${validator.MAX_CHARACTER_MESSAGE}`,
                },
                {
                  pattern: new RegExp(/[a-zA-Z]/),
                  message: validator.SPECIAL_CHARACTER_MESSAGE,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                {
                  whitespace: true,
                  message: validator.BLANK_SPACE_MESSAGE,
                },
                {
                  min: validator.MIN_CHARACTER,
                  message: `Last Name ${validator.MIN_CHARACTER_MESSAGE}`,
                },
                {
                  pattern: new RegExp(/[a-zA-Z]/),
                  message: validator.SPECIAL_CHARACTER_MESSAGE,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              name="mobile"
              label="Mobile No:"
              rules={[
                {
                  required: true,
                  message: `Please enter user's Mobile No!`,
                },
                {
                  pattern: new RegExp(/^01[3-9]\d{8}$/),
                  message: `Please enter user's valid mobile number`,
                },
              ]}
            >
              <Input
                disabled={session.role === USER_ROLE.VALUES.Admin ? false : true}
                type={"text"}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
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
              <Input
                disabled={
                  session.role === USER_ROLE.VALUES.Admin ||
                  !userData?.email ||
                  (userData?.email && !userData.isEmailVerified)
                    ? false
                    : true
                }
                type={"email"}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              name="DOB"
              label="DOB"
              rules={[
                {
                  required: true,
                  message: `Please enter user's DOB!`,
                },
              ]}
            >
              <DatePicker format={DOB_dateFormat} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              name="bloodGroup"
              label="Blood Group"
              rules={[
                {
                  message: `Please select user's Blood group!`,
                },
              ]}
            >
              <Select
                style={{ width: 120 }}
                // onChange={handleChange}
                options={bloodGroupsData.map((item) => ({ value: item, label: item }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[
                {
                  required: true,
                  message: `Please select user's Gender!`,
                },
              ]}
            >
              <Radio.Group value={1}>
                <Radio value={1}>Male</Radio>
                <Radio value={2}>Female</Radio>
                <Radio value={3}>Other</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              name="religion"
              label="Religion"
              rules={[
                {
                  message: `Please enter user's religion!`,
                  whitespace: true,
                },
              ]}
            >
              <Select
                style={{ width: 120 }}
                // onChange={handleChange}
                options={Object.entries(RELIGION_TYPE.KEYS).map(([key, text]) => ({
                  value: key,
                  label: text,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              name="maritalStatus"
              label="Marital Status"
              rules={[
                {
                  message: "Please select marital status!",
                  whitespace: true,
                },
              ]}
            >
              <Select
                style={{ width: 120 }}
                // onChange={handleChange}
                options={Object.entries(MARITAL_TYPE.KEYS).map(([key, text]) => ({
                  value: key,
                  label: text,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "message: `Please enter user's password!" },
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
                { required: true, message: `Please enter user's password!` },
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
        <Row gutter={16} justify="center" align="middle">
          {/* <Space>{children}</Space> */}
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
export default UserAdd;
