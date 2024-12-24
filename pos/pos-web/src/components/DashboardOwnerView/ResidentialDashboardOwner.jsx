import { useResidentialDashboardOwner } from "@/api/ownerDashboard/useResidentialDashboardOwner";
import styles from "../../pages/OwnerView/Dashboard/Dashboard.module.css";
import { Row, Col, Card, Spin, Result, Button } from "antd";
import AnnouncementTable from "./subComponents/AnnouncementTable";
import ResidentialWidget from "./subComponents/ResidentialWidget";
import GraphData from "./subComponents/GraphData";

const { Meta } = Card;

const ResidentialDashboardOwner = ({ propertyId, userId }) => {
  const { status, data, announcements, invoices } = useResidentialDashboardOwner(
    propertyId,
    userId,
  );

  if (status === "loading") {
    return (
      <div className={"spin"}>
        <Spin size="large" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <Result
        status="error"
        title="Invalid data"
        subTitle="Invalid data fetching error ...!"
        extra={
          <Button type="primary" onClick={() => history.goBack()}>
            Go Back
          </Button>
        }
      />
    );
  }

  return (
    <div className={styles.dashboard}>
      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        <Col xs={32} sm={24} md={24} lg={16} xl={16} className="gutter-row">
          <Card className={`criclebox ${styles.card}`}>
            <Meta title=" Total Revenue" />
            <br />
            <GraphData invoices={invoices} />
          </Card>
        </Col>
        <Col xs={32} sm={24} md={24} lg={8} xl={8} className="gutter-row">
          <ResidentialWidget invoices={invoices} data={data} />
        </Col>
        <Col xs={32} sm={24} md={24} lg={16} xl={16} className="gutter-row">
          <Card className={`criclebox ${styles.card}`}>
            <Meta title="Recent Announcement" />
            <br />
            <AnnouncementTable announcements={announcements} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default ResidentialDashboardOwner;
