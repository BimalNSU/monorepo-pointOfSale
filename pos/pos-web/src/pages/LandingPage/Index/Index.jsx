import { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
// import logo from "../../images/PropertyIconGreen.png"
import residentialImg from "../../../images/pmsLandingpage/propertyTypeIcon/residential.png";
import commercialImg from "../../../images/pmsLandingpage/propertyTypeIcon/commercial.png";

import condoImg from "../../../images/pmsLandingpage/propertyTypeIcon/condo.png";

import accountingImg from "../../../images/pmsLandingpage/accouting.png";
import tickImg from "../../../images/pmsLandingpage/tick.png";
import accountingLandingImg from "../../../images/pmsLandingpage/AccountingIllustration.png";
import sendImg from "../../../images/pmsLandingpage/send.png";
import communicationImg from "../../../images/pmsLandingpage/communication.png";
import loginImg from "../../../images/pmsLandingpage/login.png";
import ScrollElement from "rc-scroll-anim/lib/ScrollElement";

import centralLoginImg from "../../../images/pmsLandingpage/centralLogin.png";
import maintenanceImg from "../../../images/pmsLandingpage/maintenance.png";
import eLeasingImg from "../../../images/pmsLandingpage/E-leasing.png";
import maintenanceIcon from "../../../images/pmsLandingpage/maintenance_icon.png";
import eLeasingIcon from "../../../images/pmsLandingpage/e-leasing_icon.png";
// Animation (ANT MOTION)
import QueueAnim from "rc-queue-anim";
// firebase
import styles from "./Index.module.css";
import { Layout, Menu, Col, message, Row, Space, Avatar, List } from "antd";
import { Card, Typography } from "antd";
const { Title, Text, Paragraph } = Typography;

const { Meta } = Card;
const { Header, Content, Footer, Sider } = Layout;
// Profile Icon
const handleMenuClick = (e) => {
  message.info("Click on menu item.");
  console.log("click", e);
};

const Index = (props) => {
  const [textResidential, setTextResidential] = useState(false);
  const [textCommercial, setTextCommercial] = useState(false);
  const [textCondo, setTextCondo] = useState(false);
  const menus = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          label: "1st menu item",
          key: "1",
          icon: <UserOutlined />,
        },
        {
          label: "2nd menu item",
          key: "2",
          icon: <UserOutlined />,
        },
        {
          label: "3rd menu item",
          key: "3",
          icon: <UserOutlined />,
        },
      ]}
    />
  );
  // show property types description
  const displayTextResidential = () => {
    if (!textResidential) {
      setTextResidential(true);
    } else {
      setTextResidential(false);
    }
  };
  const displayTextCommercial = () => {
    if (!textCommercial) {
      setTextCommercial(true);
    } else {
      setTextCommercial(false);
    }
  };
  const displayTextCondo = () => {
    if (!textCondo) {
      setTextCondo(true);
    } else {
      setTextCondo(false);
    }
  };
  // TO DO create landing page section component
  return (
    <ScrollElement>
      <QueueAnim delay={500} className="queue-simple">
        <div className={`${styles.section_1}`}>
          <div className="container pb-5">
            <div className="row py-5 align-items-center">
              <div className="col-lg-6">
                <div className={`${styles.section_1__custom_hero_class_text_bg}`}>
                  <h5 className={`display-4 mb-4 ${styles.section_1__custom_hero_class_text}`}>
                    Manage Your Property By <br />
                    One Click
                  </h5>
                </div>
              </div>
              <div className="col-lg-6 text-lg-right text-center mt-5 mt-lg-0">
                <div className={`banner-phone-image`}></div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.section_2}`}>
          <QueueAnim delay={500} className="queue-simple">
            <Title align={"center"} level={1}>
              Property Type We Covered
            </Title>
            <div className="container pb-5">
              <div className="row" align="middle" justify="center ">
                <div className="col-xs-6 col-md-4">
                  <div
                    className={`${styles.card} ${styles.section_2__residential_bg}`}
                    onClick={displayTextResidential}
                  >
                    <br />
                    <Row align="middle" justify="center ">
                      <Col>
                        <Space
                          direction="vertical"
                          className={`${styles.section_2__card_element}`}
                          align="center"
                        >
                          <img alt="example" src={residentialImg} style={{ width: "170px" }} />
                          <Title level={2} align="center" style={{ color: "#08710D" }}>
                            Residential
                          </Title>
                          {textResidential ? (
                            <p>
                              The residential property management system is to manage different
                              units and households at a time in order to provide the best service to
                              your tenants.
                            </p>
                          ) : null}
                        </Space>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="col-xs-6 col-md-4">
                  <div
                    className={`${styles.card} ${styles.section_2__commercial_bg}`}
                    onClick={displayTextCommercial}
                  >
                    <br />
                    <Row align="middle" justify="center">
                      <Space
                        direction="vertical"
                        align="center"
                        className={`${styles.section_2__card_element}`}
                      >
                        <img alt="example" src={commercialImg} style={{ width: "160px" }} />
                        <Title level={2} align="center" style={{ color: "#5799B6" }}>
                          Commercial
                        </Title>
                        {textCommercial ? (
                          <p>
                            Commercial buildings including office buildings, retail space,
                            warehouses and more. With so many options for commercial properties in
                            all shapes and sizes, we&apos;ve made it easier to manage all these
                            different types of spaces.
                          </p>
                        ) : null}
                      </Space>
                    </Row>
                  </div>
                </div>
                <div className="col-xs-6 col-md-4">
                  <div
                    className={`${styles.card} ${styles.section_2__condo_bg}`}
                    onClick={displayTextCondo}
                  >
                    <br />
                    <Row align="middle" justify="center">
                      <Space
                        direction="vertical"
                        align="center"
                        className={`${styles.section_2__card_element}`}
                      >
                        <img alt="example" src={condoImg} style={{ width: "170px" }} />
                        <Title level={2} align="center" style={{ color: "#AD0000" }}>
                          Condominium
                        </Title>
                        {textCondo ? (
                          <p>
                            A building can have both commercial and residential units, each with its
                            own set of records, requirements and regulations to comply with. Our
                            online property management system allows you to manage your condos
                            quickly and easily. We also offer services for customizing reports for
                            you and your professionals.
                          </p>
                        ) : null}
                      </Space>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </QueueAnim>
        </div>
        <div className={`${styles.section_3}`}>
          <div className="container pb-5">
            <Title align={"center"} level={1}>
              Our Services offer you These Benefits
            </Title>
            <br />
            <Row align={"middle"} gutter={[16, 24]} justify="space-between">
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Title level={2}>
                  <Space>
                    <img alt="example" src={accountingImg} style={{ height: "70px" }} />
                    <>Property Accounting</>
                  </Space>
                </Title>
                <List itemLayout="horizontal" hoverable={`false`}>
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={tickImg} />}
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          <> Manage all your receivables and payables in one secure location </>
                        </Text>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          alt="example"
                          src={tickImg}
                          style={{ height: "30px", paddingRight: "5px" }}
                        />
                      }
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          Quickly reconcile transactions, manage notes, generate reports, and track
                          expenses
                        </Text>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          alt="example"
                          src={tickImg}
                          style={{ height: "30px", paddingRight: "5px" }}
                        />
                      }
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          You can access all information in your own time from one central.
                        </Text>
                      }
                    />
                  </List.Item>
                </List>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} align="middle" justify="center">
                <img alt="example" src={accountingLandingImg} style={{ width: "80%" }} />
              </Col>
            </Row>
          </div>
        </div>
        <div className={`${styles.section_4}`}>
          <div className="container pb-5">
            <Row align={"middle"} gutter={[16, 24]} justify="space-between">
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Title level={2}>
                  <Space>
                    <img alt="example" src={sendImg} style={{ height: "70px" }} />
                    <>Easy Communication</>
                  </Space>
                </Title>
                <List itemLayout="horizontal">
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={tickImg} />}
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          <>No more manual way of communicating with your tenants </>
                        </Text>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          alt="example"
                          src={tickImg}
                          style={{ height: "30px", paddingRight: "5px" }}
                        />
                      }
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          Take care of your tenant&apos;s requests, in a simple way to keep them
                          satisfied.
                        </Text>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          alt="example"
                          src={tickImg}
                          style={{ height: "30px", paddingRight: "5px" }}
                        />
                      }
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          Make announcements for any kind of issue and send them proper messages in
                          a mint.
                        </Text>
                      }
                    />
                  </List.Item>
                </List>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} align="middle" justify="center">
                <img alt="example" src={communicationImg} style={{ width: "80%" }} />
              </Col>
            </Row>
          </div>
        </div>
        <div className={`${styles.section_5}`}>
          <div className="container pb-5">
            <Row align={"middle"} gutter={[16, 24]} justify="space-between">
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Title level={2}>
                  <Space>
                    <img alt="example" src={loginImg} style={{ height: "70px" }} />
                    <>Central Management</>
                  </Space>
                </Title>
                <List itemLayout="horizontal">
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={tickImg} />}
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          <>
                            Manage your rental property portfolio in a single, secure, and
                            convenient system.
                          </>
                        </Text>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          alt="example"
                          src={tickImg}
                          style={{ height: "30px", paddingRight: "5px" }}
                        />
                      }
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          With our cloud-based lease management tool, you can view and manage all
                          leases, upcoming events, renewals, and progress.
                        </Text>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          alt="example"
                          src={tickImg}
                          style={{ height: "30px", paddingRight: "5px" }}
                        />
                      }
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          Update your portfolio and report on progress with automatic email
                          notifications.
                        </Text>
                      }
                    />
                  </List.Item>
                </List>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} align="middle" justify="center">
                <img alt="example" src={centralLoginImg} style={{ width: "80%" }} />
              </Col>
            </Row>
          </div>
        </div>
        <div key="e" className={`${styles.section_6}`}>
          <div className="container pb-5">
            <Row align={"middle"} gutter={[16, 24]} justify="space-between">
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Title level={2}>
                  <Space>
                    <img alt="example" src={maintenanceIcon} style={{ height: "70px" }} />
                    <>Maintenance</>
                  </Space>
                </Title>
                <List itemLayout="horizontal">
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={tickImg} />}
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          <>Allow your tenants to create and schedule their service request.</>
                        </Text>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          alt="example"
                          src={tickImg}
                          style={{ height: "30px", paddingRight: "5px" }}
                        />
                      }
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          Surveillance the maintenance progress.
                        </Text>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          alt="example"
                          src={tickImg}
                          style={{ height: "30px", paddingRight: "5px" }}
                        />
                      }
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          Review the condition and act on time.
                        </Text>
                      }
                    />
                  </List.Item>
                </List>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} align="middle" justify="center">
                <img alt="example" src={maintenanceImg} style={{ width: "80%" }} />
              </Col>
            </Row>
          </div>
        </div>

        <div className={`${styles.section_7}`}>
          <div className="container pb-5">
            <Row align={"middle"} gutter={[16, 24]} justify="space-between">
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Title level={2}>
                  <Space>
                    <img alt="example" src={eLeasingIcon} style={{ height: "70px" }} />
                    <>E-Leasing</>
                  </Space>
                </Title>
                <List itemLayout="horizontal">
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={tickImg} />}
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          <>Create automated agreement paper for your tenants.</>
                        </Text>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          alt="example"
                          src={tickImg}
                          style={{ height: "30px", paddingRight: "5px" }}
                        />
                      }
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          Set your clauses or make your clause while making rental agreements
                        </Text>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          alt="example"
                          src={tickImg}
                          style={{ height: "30px", paddingRight: "5px" }}
                        />
                      }
                      title={
                        <Text style={{ fontSize: "20px" }}>
                          Renew your leasing with an auto renewal system.
                        </Text>
                      }
                    />
                  </List.Item>
                </List>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} align="middle" justify="center">
                <img alt="example" src={eLeasingImg} style={{ width: "80%" }} />
              </Col>
            </Row>
          </div>
        </div>
      </QueueAnim>
    </ScrollElement>
  );
};
export default Index;
