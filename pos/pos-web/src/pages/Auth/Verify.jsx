import { useParams } from "react-router-dom";
import { Form, Input, Typography, Button, Row, Col, Spin, Card, Tag } from "antd";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import logo from "../../images/Property_icon.png";
import { doc, updateDoc, where, query, collection } from "firebase/firestore";
import { useAuth, useFirestore, useFirestoreCollectionData, useFirestoreDocData } from "reactfire";
import styles from "../../App.module.css";
import { useEffect, useState } from "react";

const { Title } = Typography;
const dateTimeFormat = "YYYY/MM/DD, h:mm:ss a";

const Verify = () => {
  const params = useParams();
  const auth = useAuth();
  const firestore = useFirestore();
  const [form] = Form.useForm();
  const [isUserAuthAddedBefore, setIsUserAuthAddedBefore] = useState(false);
  const [pageRefreshCount, setPageRefreshCount] = useState(0);
  const userDocRef = doc(firestore, "users", params.id);
  const { status, data } = useFirestoreDocData(userDocRef);

  const tenantDocRef = collection(firestore, "tenantAgreements");
  const q = query(tenantDocRef, where("tenantDocID", "==", params.id));
  const { status: tenantAgreementStatus, data: tenantAgreementData } =
    useFirestoreCollectionData(q);

  useEffect(() => {
    if (status === "success" && !pageRefreshCount) {
      setPageRefreshCount(pageRefreshCount + 1);
      setIsUserAuthAddedBefore(data.isUserAddedToAuth);
    }
  }, [data]);

  // Save values to User collection
  const onFinishRegistration = async (values) => {
    try {
      setPageRefreshCount(pageRefreshCount + 1);
      const res = await createUserWithEmailAndPassword(auth, data.email, values.password);
      const user = res.user;
      sendEmailVerification(user);

      if (data.role === "tenant" && tenantAgreementStatus === "success") {
        const tenantAgreementDocRef = doc(
          firestore,
          "tenantAgreements",
          tenantAgreementData[0].NO_ID_FIELD,
        );
        await updateDoc(tenantAgreementDocRef, { ["uid"]: user.uid, ["isUserAddedToAuth"]: true });
      }
      const userDocRef = doc(firestore, "users", params.id);
      await updateDoc(userDocRef, { ["isUserAddedToAuth"]: true, ["uid"]: user.uid });
      await updateProfile(user, {
        displayName: `${data.firstName} ${data.lastName}`,
        photoURL: data.profileImage,
      });
      auth.signOut();
    } catch (err) {
      console.log("error", err);
    }
  };

  if (status === "success" && pageRefreshCount && tenantAgreementStatus === "success") {
    if (!data.isUserAddedToAuth) {
      return (
        <div className="addPadding-40">
          <Row type="flex" justify="center" align="middle">
            <div className="border p-3 rounded" style={{ backgroundColor: "#f4f4f4" }}>
              <div style={{ padding: "40px" }}>
                <Title level={2} align="center">
                  <img src={logo} width={"50%"} alt="logo" />
                </Title>
                <Form
                  form={form}
                  layout="horizontal"
                  scrollToFirstError
                  labelCol={{ flex: "150px" }}
                  labelAlign="left"
                  labelWrap
                  wrapperCol={{ flex: 1 }}
                  onFinish={onFinishRegistration}
                  // onFinishFailed={onFinishPersonalInfoFormFailed}
                  autoComplete="off"
                >
                  <Row justify="space-between" gutter={12}>
                    <Col span={12}>
                      <span>Hello, {`${data.firstName} ${data.lastName}`}</span>
                    </Col>
                  </Row>
                  <Row justify="space-between" gutter={12}>
                    <Col span={12}>
                      <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="cPassword"
                        label="Confirm Password"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "Please confirm your password!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("The two passwords that you entered do not match!"),
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Button
                      type="primary"
                      size={"large"}
                      htmlType="submit"
                    >{`SignUp as ${data.role}`}</Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Row>
        </div>
      );
    } else {
      return (
        <div className="addPadding-40">
          <Row type="flex" justify="center" align="middle">
            <div className="border p-3 rounded" style={{ backgroundColor: "#f4f4f4" }}>
              <div style={{ padding: "40px" }}>
                <Card>
                  <p>
                    The verification link is sent to <Tag>{data.email}</Tag>Please check your email
                  </p>
                  <a href="/">Go to login page</a>
                </Card>
              </div>
            </div>
          </Row>
        </div>
      );
    }
  } else {
    return (
      <div className={styles.spin}>
        <Spin size="large" />
      </div>
    );
  }
};
export default Verify;
