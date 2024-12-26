import { Button, Card, Col, Form, Input, Modal, Row, Typography } from "antd";
import * as validator from "../../../../utils/Validation/Validation";
import { apiProvider } from "@/utils/ApiProvider/ApiProvider";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import { useCustomProperty } from "@/utils/hooks/customProperty";
import { error, success } from "@/utils/Utils/Utils";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Title } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;
const targetRole = "vendor";

const VendorAdd = () => {
  const { role, getToken } = useCustomAuth();
  const { propertyId } = useCustomProperty();
  const navigate = useNavigate();
  const [vendorForm] = Form.useForm();

  const handleFinish = (values) => {
    const verb = "create";
    console.log(values);
    confirm({
      title: `Are you sure to ${verb} a new vendor?`,
      async onOk() {
        const token = await getToken();
        const res = await apiProvider.accounting.createVendor(token, role, propertyId, {
          name: values.name,
          mobile: values.mobile,
          ...(values.email ? { email: values.email } : {}),
          ...(values.address ? { address: values.address } : {}),
        });
        if (res.status === 201) {
          success(`Created new vendor successfully`);
          vendorForm.resetFields();
        } else {
          error(`Fail to create vendor...`);
        }
      },
    });
  };
  return (
    <div className="addPadding-10">
      {/* <div className={`border p-3 rounded`}> */}
      <Card title={<Title level={5}>Create Vendor</Title>}>
        <Row gutter={16} justify="right" align="middle">
          <Button
            // className={styles.btn}
            type="secondary"
            // onClick={() => changeTab("2")}
            shape="circle"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftOutlined />
          </Button>
        </Row>
        <Form
          form={vendorForm}
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
          {/* <Row justify="space-between">
        <Col>
          <Title level={3}>Personal Info.</Title>
        </Col>
        <Col>
          <ImageUploadWithPreview name="profileImage" src={profileImage} />
        </Col>
      </Row> */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: `Please enter ${targetRole}'s Name!`,
                  },
                  {
                    whitespace: true,
                    message: validator.BLANK_SPACE_MESSAGE,
                  },
                  {
                    min: validator.MIN_CHARACTER,
                    message: `Name ${validator.MIN_CHARACTER_MESSAGE}`,
                  },
                  {
                    max: validator.MAX_CHARACTER,
                    message: `Name ${validator.MAX_CHARACTER_MESSAGE}`,
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
            {/* <Col span={12}>
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
        </Col> */}
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
                <Input type={"text"} />
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
                <Input type="email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address:"
                rules={[
                  {
                    required: true,
                    message: `Please enter ${targetRole}'s Address!`,
                  },
                ]}
              >
                <TextArea />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} justify="center" align="middle">
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: "green" }}>
                Save
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
      {/* </div> */}
    </div>
  );
};
export default VendorAdd;
