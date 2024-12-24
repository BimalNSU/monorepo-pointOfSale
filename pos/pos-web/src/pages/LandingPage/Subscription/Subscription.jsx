import tickImg from "../../../images/tick.png";
import { Layout, Col, Collapse, Row, List } from "antd";
import { Card, Typography } from "antd";
// import styles from  './Subscription.module.css';

const { Title, Text, Paragraph } = Typography;

const { Panel } = Collapse;
const { Meta } = Card;
const { Header, Content, Footer, Sider } = Layout;
const RowDataComponent = (props) => {
  const { propertyFeature, free, standard, premimun } = props;
  return (
    <Row style={{ width: "100%" }}>
      <Col span={6}>{propertyFeature}</Col>
      <Col span={6}>{free ? <img alt="example" src={tickImg} /> : null}</Col>
      <Col span={6}>{standard ? <img alt="example" src={tickImg} /> : null}</Col>
      <Col span={6}>{premimun ? <img alt="example" src={tickImg} /> : null}</Col>
    </Row>
  );
};
const data = [
  <RowDataComponent
    key="Manage  One Property(Up to 10 units)"
    propertyFeature={"Manage  One Property(Up to 10 units)"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Manage  Two Properties(Up to 20 Units)"
    propertyFeature={"Manage  Two Properties(Up to 20 Units)"}
    standard
    premimun
  />,
  <RowDataComponent
    key="Up to 10 properties with 100 units"
    propertyFeature={"Up to 10 properties with 100 units"}
    premimun
  />,
];
const accountingFeatureData = [
  <RowDataComponent
    key="Accounting - Create Property Bills"
    propertyFeature={"Create Property Bills"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Accounting - Create Common Bills"
    propertyFeature={"Create Common Bills"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Accounting - Add Recurring Bills"
    propertyFeature={"Add Recurring Bills"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Accounting - Create Invoice"
    propertyFeature={"Create Invoice"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Accounting - Create Payroll for staff"
    propertyFeature={"Create Payroll for staff"}
    standard
    premimun
  />,
  <RowDataComponent
    key="Accounting - View Payment Status"
    propertyFeature={"View Payment Status"}
    premimun
  />,
  <RowDataComponent
    key="Accounting - View total Income & search income"
    propertyFeature={"View total Income & search income"}
    premimun
  />,
  <RowDataComponent
    key="Accounting - View total Expense list"
    propertyFeature={"View total Expense list"}
    premimun
  />,
];
const communicationFeatureData = [
  <RowDataComponent
    key="Communication - Email notification"
    propertyFeature={"Email notification"}
    standard
    premimun
  />,
  <RowDataComponent
    key="Communication - Create Announcement"
    propertyFeature={"Create Announcement"}
    premimun
  />,
  <RowDataComponent key="Communication - Send Message" propertyFeature={"Send Message"} premimun />,
];
// TO DO
const managerFeatureData = [
  <RowDataComponent
    key="Manager - Manager Dashboard"
    propertyFeature={"Manager Dashboard"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Manager - Add Property"
    propertyFeature={"Add Property"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Manager - Add Owner"
    propertyFeature={"Add Owner"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Manager - Manager Dashboard"
    propertyFeature={"Manager Dashboard"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Manager - Add Property"
    propertyFeature={"Add Property"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Manager - Add Owner"
    propertyFeature={"Add Owner"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Manager - Add Tenant"
    propertyFeature={"Add Tenant"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Manager - Add Property Bill"
    propertyFeature={"Add Property Bill"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Manager - Add Common Bills"
    propertyFeature={"Add Common Bills"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Manager - Add Recuring Bills"
    propertyFeature={"Add Recuring Bills"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Manager - Create Invoice"
    propertyFeature={"Create Invoice"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Manager - Create Agreement"
    propertyFeature={"Create Agreement"}
    standard
    premimun
  />,
  <RowDataComponent
    key="Manager - Service Request"
    propertyFeature={"Service Request"}
    standard
    premimun
  />,
  <RowDataComponent
    key="Manager - Create Announcement"
    propertyFeature={"Create Announcement"}
    premimun
  />,
  <RowDataComponent key="Manager - Manage Access" propertyFeature={"Manage Access"} premimun />,
];

const ownerFeatureData = [
  <RowDataComponent
    key="Owner -Tenant Dashboard"
    propertyFeature={"Tenant Dashboard"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Owner -Tenant list"
    propertyFeature={"Tenant list"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Owner -View Invoice List"
    propertyFeature={"View Invoice List"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Owner -View Income"
    propertyFeature={"View Income"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Owner -View expense"
    propertyFeature={"View expense"}
    free
    standard
    premimun
  />,
  <RowDataComponent key="Owner -Agreement" propertyFeature={"Agreement"} free standard premimun />,
  <RowDataComponent
    key="Owner -View Payment Status"
    propertyFeature={"View Payment Status"}
    standard
    premimun
  />,
  <RowDataComponent key="Owner -Service Request" propertyFeature={"Service Request"} premimun />,
  <RowDataComponent
    key="Owner -Email Notification"
    propertyFeature={"Email Notification"}
    premimun
  />,
  <RowDataComponent
    key="Owner -Message communication"
    propertyFeature={"Message communication"}
    premimun
  />,
  <RowDataComponent key="Owner -Search Property" propertyFeature={"Search Property"} premimun />,
];
const tenantFeatureData = [
  <RowDataComponent
    key="Tenant - Tenant Dashboard"
    propertyFeature={"Tenant Dashboard"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Tenant - Agreement"
    propertyFeature={"Agreement"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Tenant - View Invoice List"
    propertyFeature={"View Invoice List"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Tenant - View Expense amount & list"
    propertyFeature={"View Expense amount & list"}
    free
    standard
    premimun
  />,
  <RowDataComponent
    key="Tenant - View Payment Status"
    propertyFeature={"View Payment Status"}
    standard
    premimun
  />,
  <RowDataComponent key="Tenant - Service Request" propertyFeature={"Service Request"} premimun />,
  <RowDataComponent
    key="Tenant - Email Notification"
    propertyFeature={"Email Notification"}
    premimun
  />,
  <RowDataComponent
    key="Tenant - Message coomunication"
    propertyFeature={"Message coomunication"}
    premimun
  />,
  <RowDataComponent key="Tenant - Search Property" propertyFeature={"Search Property"} premimun />,
];
const associationFeatureData = [
  <RowDataComponent
    key="Association - Create Association List"
    propertyFeature={"Create Association List"}
    premimun
  />,
  <RowDataComponent key="Association - Add Manager" propertyFeature={"Add Manager"} premimun />,
  <RowDataComponent
    key="Association - Send Confirmation"
    propertyFeature={"Send Confirmation"}
    premimun
  />,
];
const commingSoonFeatureData = [
  <RowDataComponent
    key="My Task Module for manager"
    propertyFeature={"My Task Module for manager"}
    premimun
  />,
  <RowDataComponent
    key="Advance Search on payment Status"
    propertyFeature={"Advance Search on payment Status"}
    premimun
  />,
  <RowDataComponent
    key="Add Excel Files to property bills"
    propertyFeature={"Add Excel Files to property bills"}
    premimun
  />,
  <RowDataComponent
    key="Communicate with Neighbors"
    propertyFeature={"Communicate with Neighbors"}
    premimun
  />,
];
const Subscription = (props) => {
  // show property types description
  return (
    <>
      <br />
      <br />
      <div className={`container pb-5`}>
        <Title align={"center"} level={1}>
          Convinient Planning
        </Title>
        <Title align={"center"} level={2}>
          Choose the right planning and get started
        </Title>
        <br />
        <Row align={"middle"} justify="space-around">
          <Col span={24}>
            <Collapse defaultActiveKey={["1"]} expandIconPosition={"end"}>
              <Panel
                style={{ backgroundColor: "#71BD44" }}
                header={
                  <Row style={{ width: "100%", color: "#f4f4f4", fontWeight: "bold" }}>
                    <Col span={6}>Property Features</Col>
                    <Col span={6}>
                      Free <br />
                      00 TK / month
                    </Col>
                    <Col span={6}>
                      Standard <br />
                      999 TK / month
                    </Col>
                    <Col span={6}>
                      Premium <br />
                      1999 TK / month
                    </Col>
                  </Row>
                }
                key="1"
              >
                <List
                  size="large"
                  dataSource={data}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Panel>
              <Panel
                header={<Text style={{ fontWeight: "bold" }}>Accounrting </Text>}
                key="2"
                style={{ backgroundColor: "#E2FFDB" }}
              >
                <List
                  size="large"
                  dataSource={accountingFeatureData}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Panel>
              <Panel
                header={
                  <Text style={{ fontWeight: "bold", color: "white" }}>
                    Communication Features{" "}
                  </Text>
                }
                style={{ backgroundColor: "#71BD44" }}
                key="3"
              >
                <List
                  size="large"
                  dataSource={communicationFeatureData}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Panel>
              <Panel
                header={<Text style={{ fontWeight: "bold" }}>Building Manager Feature List </Text>}
                style={{ backgroundColor: "#E2FFDB" }}
                key="4"
              >
                <List
                  size="large"
                  dataSource={managerFeatureData}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Panel>
              <Panel
                header={
                  <Text style={{ fontWeight: "bold", color: "white" }}>
                    Building Owner Feature List{" "}
                  </Text>
                }
                style={{ backgroundColor: "#71BD44" }}
                key="5"
              >
                <List
                  size="large"
                  dataSource={ownerFeatureData}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Panel>
              <Panel
                header={<Text style={{ fontWeight: "bold" }}>Building Tenant Feature List </Text>}
                style={{ backgroundColor: "#E2FFDB" }}
                key="6"
              >
                <List
                  size="large"
                  dataSource={tenantFeatureData}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Panel>
              <Panel
                header={
                  <Text style={{ fontWeight: "bold", color: "white" }}>Create Association </Text>
                }
                style={{ backgroundColor: "#71BD44" }}
                key="7"
              >
                <List
                  size="large"
                  dataSource={associationFeatureData}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Panel>
              <Panel
                header={<Text style={{ fontWeight: "bold" }}>Comming Soon </Text>}
                style={{ backgroundColor: "#E2FFDB" }}
                key="8"
              >
                <List
                  size="large"
                  dataSource={commingSoonFeatureData}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </div>
      <br />
    </>
  );
};
export default Subscription;
