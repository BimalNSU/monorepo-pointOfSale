import styles from "./Footer.module.css";

// import logo from "../../images/PropertyIconGreen.png"
import { Layout, Row, Col, Input, Space, Button, Typography, List } from "antd";
// footer img and icon
import commercialAtIcon from "@/images/pmsLandingpage/footer/commercialAtIcon.png";
import locationIcon from "@/images/pmsLandingpage/footer/locationIcon.png";
import phoneIcon from "@/images/pmsLandingpage/footer/phoneIcon.png";
import websiteIcon from "@/images/pmsLandingpage/footer/websiteIcon.png";
import fbIcon from "@/images/pmsLandingpage/footer/smIcon/fbIcon.png";
import instaIcon from "@/images/pmsLandingpage/footer/smIcon/instaIcon.png";
import twitterIcon from "@/images/pmsLandingpage/footer/smIcon/twitterIcon.png";
import linkdnIcon from "@/images/pmsLandingpage/footer/smIcon/linkdnIcon.png";

const { Title, Text, Paragraph } = Typography;
const { Footer } = Layout;

const CustomFooter = (props) => {
  return (
    <Footer className={styles.customFooter}>
      <div className={`${styles.footer} container pb-5`}>
        <Row align={"top"} gutter={[16, 24]} justify={"center"}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Space direction="vertical">
              <Row>
                <Space direction="vertical">
                  {/* <img alt="example" src={loginImg} style={{ height: "70px", }} /> */}
                  <Title level={4}>Newsletter</Title>
                  <Text>Sign Up & receive the latest tips via email</Text>
                  <Input placeholder="Your Email" />
                  <Button
                    style={{
                      backgroundColor: "#71BD44",
                      color: "#f4f4f4",
                      borderRadius: "3px",
                    }}
                  >
                    Subscribe
                  </Button>
                </Space>
              </Row>
              <Row>
                <Space direction="horizonal">
                  <img alt="example" src={fbIcon} style={{ paddingRight: "5px" }} />
                  <img alt="example" src={instaIcon} style={{ paddingRight: "5px" }} />
                  <img alt="example" src={twitterIcon} style={{ paddingRight: "5px" }} />
                  <img alt="example" src={linkdnIcon} style={{ paddingRight: "5px" }} />
                </Space>
              </Row>
            </Space>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Space direction="vertical">
              {/* <img alt="example" src={loginImg} style={{ height: "70px", }} /> */}
              <Title level={4}>Contact</Title>
              <List itemLayout="horizontal">
                <List.Item>
                  <List.Item.Meta
                    avatar={<img alt="example" src={phoneIcon} style={{ paddingRight: "5px" }} />}
                    description={<Text>+88 01894800651</Text>}
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <img alt="example" src={locationIcon} style={{ paddingRight: "5px" }} />
                    }
                    description={
                      <Text>
                        House 468 (1st Floor), Road 06, Avenue 06, Mirpur DOHS, Dhaka - 1216,
                        Bangladesh
                      </Text>
                    }
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <img alt="example" src={commercialAtIcon} style={{ paddingRight: "5px" }} />
                    }
                    description={<Text>info@cdprc.com</Text>}
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<img alt="example" src={websiteIcon} style={{ paddingRight: "5px" }} />}
                    description={<Text>http://www.cdprc.com</Text>}
                  />
                </List.Item>
              </List>

              <Title level={4}>Brought To You By</Title>
              <Text>Circle Data Processing & Research Center</Text>
            </Space>
            {/* <img alt="example" src={eLeasingImg} style={{ height: "80%" }} /> */}
          </Col>
        </Row>
      </div>
    </Footer>
  );
};
export default CustomFooter;
