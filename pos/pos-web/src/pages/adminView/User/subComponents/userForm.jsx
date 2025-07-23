import { Button, Col, DatePicker, Form, Input, Radio, Row, Select, Typography } from "antd";
import * as validator from "../../../../utils/Validation/Validation";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { USER_ROLE } from "@/constants/role";
import { DOB_dateFormat } from "@/constants/dateFormat";
import { MARITAL_TYPE, RELIGION_TYPE } from "@/constants/common";
import { useEffect } from "react";
import dayjs from "dayjs";
const { Title } = Typography;
const bloodGroupsData = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const UserForm = ({ mode, userData, onSubmit, onCancel }) => {
  const { session } = useFirebaseAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    if (userData) {
      const formData = {
        role: userData.role,
        // isActive: userData.isActive,
        firstName: userData.firstName,
        lastName: userData.lastName || null,
        mobile: userData.mobile,
        email: userData.email || null,
        DOB: dayjs(userData.DOB),
        bloodGroup: userData.bloodGroup || null,
        gender: userData.gender,
        religion: userData.religion || null,
        maritalStatus: userData.maritalStatus || null,
      };
      form.setFieldsValue(formData);
    }
  }, [userData]);
  const handleFinish = (formData) => {
    const processData = {
      firstName: formData.firstName,
      lastName: formData.lastName || null,
      mobile: formData.mobile,
      email: formData.email || null,
      DOB: formData.DOB.startOf("day").toDate(),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup || null,
      maritalStatus: formData.maritalStatus || null,
      religion: formData.religion || null,
      role: formData.role,
    };
    onSubmit(processData, form);
  };
  return (
    <>
      {/* <Title level={4} style={{ textAlign: "center" }}>
        {mode === "edit" ? "Edit User" : "Add User"}
      </Title> */}
      <Form
        form={form}
        onFinish={handleFinish}
        layout="horizontal"
        labelCol={{ flex: "100px" }}
        labelAlign="left"
        labelWrap
        // onFinishFailed={onFinishFailed}
        wrapperCol={{ flex: 1 }}
      >
        <Row gutter={[16, 1]}>
          <Col span={24}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: `Please select user's role!` }]}
            >
              <Select
                style={{ width: 120 }}
                options={Object.entries(USER_ROLE.KEYS).map(([key, text]) => ({
                  value: Number(key),
                  label: text,
                }))}
              />
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
                  whitespace: true,
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

        <Row
          gutter={[16, 1]}
          justify="center"
          // style={{ paddingBottom: "0px", marginBottom: "0px" }}
        >
          {/* <Space>{children}</Space> */}
          <Col>
            <Button onClick={onCancel}>Cancel</Button>
          </Col>
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {mode === "edit" ? "Update" : "Create"}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default UserForm;
