import aboutImg from "../../../images/about/about.png";

import styles from "./About.module.css";
import { Col, Row, Space } from "antd";
import { Typography } from "antd";
const { Title, Text, Paragraph } = Typography;

// Profile Icon

const About = (props) => {
  // show property types description
  return (
    <>
      <div className={`${styles.section_3}`}>
        <div className="container pb-5">
          <Space direction="vertical">
            <Row justify="center">
              <img alt="example" src={aboutImg} width={"70%"} />
            </Row>
            <br />
            <Title align={"center"} level={1}>
              About Bulbuli.xyz
            </Title>
            <Row align={"middle"} justify="space-around">
              <Col span={16}>
                <Paragraph>
                  Bulbuli is a property management SAAS(Software as a service) platform. The idea of
                  managing property through a software is a very new idea in bangladesh.
                </Paragraph>
                <Paragraph>
                  A team of talented people are at the helm of Bulbuli. The simplicity of the
                  software makes this unique.
                </Paragraph>
                <Paragraph>
                  We understand how stressful life can be when you must deal with your monthly rents
                  from your tenants or repair a kitchen blockage at 2nd floor or arranging a monthly
                  meeting by calling every tenant one by one. Even if you already have a manager for
                  this job, you worry not to have present / past data altogether or how much time
                  you worry not to have present/past data altogether or how much time you will need
                  to check all these documents manually let alone getting the date or the money
                  sorted in order.
                </Paragraph>
                <Paragraph>
                  This is where we can help you. Our purpose is to manage billings, repairing,
                  communication of one or multiple properties simplified to the owners. Majority of
                  it’s features we kept free for you.
                </Paragraph>
                <Paragraph>
                  People usually are happiest at home. We believe, we can enhance that happienss by
                  keeping your home well managed and organized.
                </Paragraph>
              </Col>
            </Row>
          </Space>
        </div>
      </div>
      <br />
    </>
  );
};
export default About;
