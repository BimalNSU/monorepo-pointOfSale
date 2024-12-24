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
} from "antd";
// import * as validator from "../../../utils"
import * as validator from "../../../utils/Validation/Validation";

import { success, error, deleteUndefinedFromObj, checkValueExist } from "@/utils/Utils/Utils";

import moment from "moment";
const bloodGroupsData = []

// import { apiProvider } from "@/utils/ApiProvider/ApiProvider";
// import { useCustomAuth } from "@/utils/hooks/customAuth";
// import { Address } from "@/components/Address/AddressComponent";
// import FetchFile from "../../FetchFile/FetchFile";
// import FileUpload from "../../FIleUpload/FileUpload";
import ImageUploadWithPreview from "../../FIleUpload/ImageUploadWithPreview";
import { DOB_dateFormat } from "@/constants/dateFormat";
import { RELIGION_TYPE } from "@/constants/religion";

const { Option } = Select;
const { Title, Text } = Typography;

const PersonalInfoForm = ({ targetRole, onSubmit, userData, children, isAdmin }) => {
  const [personalInfoForm] = Form.useForm();

  const [profileImage, setProfileImage] = useState("");
  useEffect(() => {
    if (userData) {
      const formData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobile: userData.mobile,
        email: userData.email || null,
        DOB: moment(userData.DOB),
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
      profileImage: data.profileImage,
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.mobile,
      email: data.email || null,
      DOB: data.DOB.startOf("day").toDate(),
      bloodGroup: data.bloodGroup || null,
      gender: data.gender,
      religion: data.religion || null,
      maritalStatus: data.maritalStatus || null,
      occupation: data.occupation || null,
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
      labelCol={{ flex: "150px" }}
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
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              {
                required: true,
                message: `Please enter ${targetRole}'s First Name!`,
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
        <Col span={12}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              { required: true, message: `Please enter ${targetRole}'s Last Name!` },
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
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="mobile"
            label="Mobile No:"
            rules={[
              {
                required: true,
                message: `Please enter ${targetRole}'s Mobile No!`,
              },
              {
                pattern: new RegExp(/^01[3-9]\d{8}$/),
                message: `Please enter ${targetRole}'s valid mobile number`,
              },
            ]}
          >
            <Input disabled={isAdmin ? false : true} type={"text"} />
          </Form.Item>
        </Col>
        <Col span={12}>
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
                isAdmin || !userData.email || (userData.email && !userData.isEmailVerified)
                  ? false
                  : true
              }
              type={"email"}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="DOB"
            label="DOB"
            rules={[
              {
                required: true,
                message: `Please enter ${targetRole}'s DOB!`,
              },
            ]}
          >
            <DatePicker format={DOB_dateFormat} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="bloodGroup"
            label="Blood Group"
            rules={[
              {
                message: `Please select ${targetRole}'s Blood group!`,
              },
            ]}
          >
            <Select
              style={{
                width: 120,
              }}
              // onChange={handleChange}
            >
              {bloodGroupsData.map((item, index) => (
                <Option key={index} value={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
                message: `Please select ${targetRole}'s Gender!`,
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
        <Col span={12}>
          <Form.Item
            name="religion"
            label="Religion"
            rules={[
              {
                message: `Please enter ${targetRole}'s religion!`,
                whitespace: true,
              },
            ]}
          >
            <Select
              style={{
                width: 120,
              }}
              // onChange={handleChange}
              options={Object.values(RELIGION_TYPE.KEYS).map((r) => ({
                value: r.type,
                label: r.text,
              }))}
            >
              {/* <Option value="islam">Islam</Option>
              <Option value="hindu">Hindu</Option>
              <Option value="buddhism">Buddhism</Option>
              <Option value="christianity">Christianity</Option>
              <Option value="others">Others</Option> */}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
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
              style={{
                width: 120,
              }}
              // onChange={handleChange}
            >
              <Option value="unmarried">Unmarried</Option>
              <Option value="married">Married</Option>
              <Option value="divorced">Divorced</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="occupation"
            label="Occupation"
            rules={[
              {
                message: `Please enter ${targetRole}'s occupation!`,
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      {userData?.rawPassword ? (
        <Space direction="horizontal">
          <Text>Raw Password:</Text>{" "}
          <Text type="danger" strong>
            {userData.rawPassword}
          </Text>
        </Space>
      ) : null}
      <Row gutter={16} justify="center" align="middle">
        <Space>{children}</Space>
      </Row>
    </Form>
  );
};
export default PersonalInfoForm;
