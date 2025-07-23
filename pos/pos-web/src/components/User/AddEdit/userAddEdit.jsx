import React, { useState, useEffect, Children } from "react";
// import styles from "./Personal.module.css";
import {
  Form,
  Input,
  Tabs,
  Row,
  Radio,
  Col,
  DatePicker,
  Typography,
  Select,
  Space,
  Result,
  Switch,
  Button,
} from "antd";
import * as validator from "../../../utils/Validation/Validation";
import { success, error, deleteUndefinedFromObj, checkValueExist } from "@/utils/Utils/Utils";
import dayjs from "dayjs";
const bloodGroupsData = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// import { apiProvider } from "@/utils/ApiProvider/ApiProvider";
// import { useCustomAuth } from "@/utils/hooks/customAuth";
// import { Address } from "@/components/Address/AddressComponent";
// import FetchFile from "../../FetchFile/FetchFile";
// import FileUpload from "../../FIleUpload/FileUpload";
import ImageUploadWithPreview from "../../FIleUpload/ImageUploadWithPreview";
import { DOB_dateFormat } from "@/constants/dateFormat";
import { MARITAL_TYPE, RELIGION_TYPE } from "@/constants/common";
import { ROLE, USER_ROLE } from "@/constants/role";

const { Option } = Select;
const { Title, Text } = Typography;
const { Password } = Input;

const UserAddEdit = ({ onSubmit, userData, children, authRole }) => {
  const [personalInfoForm] = Form.useForm();

  const [profileImage, setProfileImage] = useState("");
  useEffect(() => {
    if (userData) {
      const formData = {
        role: userData.role,
        isActive: userData.isActive,
        firstName: userData.firstName,
        lastName: userData.lastName || null,
        mobile: userData.mobile,
        email: userData.email || null,
        DOB: dayjs(userData.DOB),
        bloodGroup: userData.bloodGroup || null,
        gender: userData.gender,
        religion: userData.religion || null,
        maritalStatus: userData.maritalStatus || null,
        occupation: userData.occupation || null,
      };
      setProfileImage(userData.profileImage);
      personalInfoForm.setFieldsValue(formData);
    }
  }, [userData]);

  const handleFinish = (data) => {
    const personalInfo = {
      role: data.role,
      profileImage: data.profileImage,
      firstName: data.firstName,
      lastName: data.lastName || null,
      mobile: data.mobile,
      email: data.email || null,
      DOB: data.DOB.startOf("day").toDate(),
      bloodGroup: data.bloodGroup || null,
      gender: data.gender,
      religion: data.religion || null,
      maritalStatus: data.maritalStatus || null,
      occupation: data.occupation || null,
      password: data.password,
    };
    onSubmit(personalInfo, personalInfoForm);
  };

  return (
    <Form
      form={personalInfoForm}
      name="register"
      onFinish={handleFinish}
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
          <ImageUploadWithPreview name="profileImage" src={profileImage} />
        </Col>
      </Row>
      <Row gutter={[16, 10]} justify="space-between">
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select
              style={{ width: 120 }}
              options={Object.values(ROLE).map((r) => ({ value: r.type, label: r.text }))}
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
            <Input disabled={authRole === USER_ROLE.VALUES.Admin ? false : true} type={"text"} />
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
                authRole === USER_ROLE.VALUES.Admin ||
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
              {!userData ? "Add" : "Update"}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default UserAddEdit;
