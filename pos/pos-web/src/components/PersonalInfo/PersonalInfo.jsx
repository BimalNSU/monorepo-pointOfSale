import { Component, useState } from "react";
import styles from "./PersonalInfo.module.css";
import { Form, Input, Select, Tabs, Row, Radio, Col, DatePicker, Typography, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;

class PersonalInfoComponent extends Component {
  render() {
    return (
      <div className="border p-4 rounded">
        <Row justify="space-between">
          <Col>
            <Title level={4}>Personal informations</Title>
            <Title level={5}>
              2/2 Sher-E-Bangla road, Radia Vila,
              <br />
              House-478, Dhaka-1212
            </Title>
          </Col>
          <Col></Col> <img className={styles.profile_img} src="images/faces/face27.jpg" alt="" />
        </Row>
        <Form
          form={this.props.form}
          name="register"
          onFinish={this.props.onFinish}
          layout="horizontal"
          scrollToFirstError
          labelCol={{ flex: "150px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={true}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please input your First Name!", whitespace: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please input your Last Name!", whitespace: true }]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="DOB"
                label="DOB"
                rules={[{ required: true, message: "Please input your DOB!", whitespace: true }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bloodGroup"
                label="Blood Group"
                rules={[
                  { required: true, message: "Please input your Blood Group!", whitespace: true },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Please select Gender!" }]}
              >
                <Radio.Group onChange={this.props.onChange} value={this.props.value}>
                  <Radio value={1}>Male</Radio>
                  <Radio value={2}>Female</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="religion"
                label="Religion"
                rules={[
                  { required: true, message: "Please input your Blood Group!", whitespace: true },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="maritalstatus"
                label="Marital Status"
                rules={[{ required: true, message: "Please select Marital Status!" }]}
              >
                <Radio.Group onChange={this.props.onChange} value={this.props.value}>
                  <Radio value={1}>Single</Radio>
                  <Radio value={2}>Married</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="occupation"
                label="Occupation"
                rules={[
                  { required: true, message: "Please input your Occupations!", whitespace: true },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="birthcertificate"
                label="Birth Certificate No:"
                rules={[
                  {
                    required: true,
                    message: "Please input your Birth Certificate No!",
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="NID"
                label="NID No:"
                rules={[{ required: true, message: "Please input your NID No!", whitespace: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="passportNo"
                label="Passport No"
                rules={[
                  { required: true, message: "Please input your Passport No!", whitespace: true },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="BINVAT"
                label="BIN/VAT No:"
                rules={[
                  { required: true, message: "Please input your BIN/VAT!", whitespace: true },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="drivingLicence"
                label="Driving Licence"
                rules={[
                  {
                    required: true,
                    message: "Please input your Driving Licence!",
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="numberFamilyMember"
                label="Family Member:"
                rules={[
                  {
                    required: true,
                    message: "Please input number of Family member!",
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item {...this.props.tailFormItemLayout}>
            <a href="/addcontactinfo">
              <Button
                className={styles.btn}
                type="primary"
                htmlType="submit"
                style={{ paddingRight: "20" }}
              >
                Save & Create
              </Button>
            </a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
PersonalInfoComponent.defaultProps = {};
export default PersonalInfoComponent;
