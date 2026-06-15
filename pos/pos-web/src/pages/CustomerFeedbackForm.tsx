import { Button, Card, Col, Form, Input, Rate, Row, Typography, message } from "antd";
import styles from "./CustomerFeedbackForm.module.css";
import { useFirestore } from "reactfire";
import CustomerFeedbackService from "@/service/customerFeedback.service";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { useDocumentFormat } from "@/api/useDocumentFormat";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
import Loading from "@/components/loading";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface FeedbackFormValues {
  customerName: string;
  mobile: string;
  collection: number;
  valueForMoney: number;
  staffService: number;
  storeAmbience: number;
  revisitReason: string;
  improvement?: string;
}

const CustomerFeedbackForm = () => {
  const { userId } = useFirebaseAuth();
  const [form] = Form.useForm();
  const db = useFirestore();
  const feedbackService = new CustomerFeedbackService(db);
  const { status: feedbackCounterStatus, documentId: newFeedbackId } = useDocumentFormat(
    DOCUMENT_FORMAT.VALUES.CustomerFeedback,
  );

  const onFinish = async (values: FeedbackFormValues) => {
    if (!newFeedbackId || !userId) {
      message.error("Fail to add feedback. Try again..");
      return;
    }
    const { improvement, ...rest } = values;
    await feedbackService.create(
      { ...rest, improvement: improvement || null, id: newFeedbackId },
      userId,
    );

    message.success("Thank you for your valuable feedback!");
    form.resetFields();
  };

  if (feedbackCounterStatus === "loading") {
    return <Loading />;
  }
  return (
    <div className={styles.container}>
      <Card className={styles.card} size="small">
        <div className={styles.header}>
          <Title level={2} className={styles.title}>
            🎁 Help Us Improve & Win a Surprise Gift!
          </Title>

          <Text className={styles.subtitle}>Your feedback helps us serve you better.</Text>
        </div>

        <Form
          form={form}
          layout="horizontal"
          onFinish={onFinish}
          // className={styles.form}
          labelCol={{ flex: "130px" }}
          labelAlign="left"
          labelWrap
          // wrapperCol={{ flex: 1 }}
        >
          <div className={styles.section}>
            <Title level={5}>Customer Information</Title>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Customer Name"
                  name="customerName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your name",
                    },
                  ]}
                >
                  <Input placeholder="Enter your name" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Mobile Number"
                  name="mobile"
                  rules={[
                    {
                      required: true,
                      message: "Please enter mobile number",
                    },
                    {
                      pattern: /^[0-9+\-\s]+$/,
                      message: "Invalid mobile number",
                    },
                  ]}
                >
                  <Input placeholder="01XXXXXXXXX" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className={styles.section}>
            <Title level={5}>Rate Your Experience</Title>

            <Form.Item
              label="🛍️ Collection"
              name="collection"
              rules={[{ required: true }]}
              labelCol={{ span: 6 }}
            >
              <Rate className={styles.rate} />
            </Form.Item>

            <Form.Item
              label="💰 Value for Money"
              name="valueForMoney"
              rules={[{ required: true }]}
              labelCol={{ span: 6 }}
            >
              <Rate className={styles.rate} />
            </Form.Item>

            <Form.Item
              label="😊 Staff Service"
              name="staffService"
              rules={[{ required: true }]}
              labelCol={{ span: 6 }}
            >
              <Rate className={styles.rate} />
            </Form.Item>

            <Form.Item
              label="🏪 Store Ambience"
              name="storeAmbience"
              rules={[{ required: true }]}
              labelCol={{ span: 6 }}
            >
              <Rate className={styles.rate} />
            </Form.Item>
          </div>

          <div className={styles.section}>
            <Title level={5}>Tell Us More</Title>

            <Form.Item
              label='Complete the sentence: "I would visit Organic Design again because..."'
              name="revisitReason"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Please share your experience",
                },
              ]}
            >
              <TextArea rows={4} maxLength={500} showCount placeholder="Share your experience..." />
            </Form.Item>

            <Form.Item
              label="One thing we should improve"
              name="improvement"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <TextArea rows={4} maxLength={500} showCount placeholder="Your suggestion..." />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" size="large" block>
            Submit Feedback
          </Button>
        </Form>
      </Card>
    </div>
  );
};
export default CustomerFeedbackForm;
