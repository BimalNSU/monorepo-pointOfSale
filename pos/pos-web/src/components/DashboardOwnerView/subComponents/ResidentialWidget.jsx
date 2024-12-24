import { useState, useEffect, useMemo } from "react";
import { Progress, Card, Typography, Row, Col } from "antd";
import { HomeOutlined, KeyOutlined, UserOutlined, TagsOutlined } from "@ant-design/icons";
import styles from "../../../components/Dashboard/Dashboard.module.css";
import { convertToBD } from "@/constants/currency";

const { Title, Text } = Typography;

const ResidentialWidget = ({ invoices, data }) => {
  const [numTenant, setNumTenant] = useState();
  const [tenantInProgress, setTenantInProgress] = useState();

  const [totalUnits, setTotalUnits] = useState();
  const [occupiedInProgress, setOccupiedInProgress] = useState();

  const [numVaccant, setNumVaccant] = useState();
  const [vaccantInProgress, setVaccantInProgress] = useState();

  const [fontSize, setFontSize] = useState();

  //Circular Progress for Residential (Owner)

  //Rent Collection
  const result = useMemo(() => {
    if (!invoices) {
      return {
        unpaid: 0,
        total: 0,
      };
    }

    const unpaidRent = invoices.filter((invoice) => invoice.paymentStatus === "unpaid");

    const unpaidRentAmount = unpaidRent.map((el) =>
      Object.entries(el.pBills || {}).map(([key, value]) => ({
        key,
        unitRent: value.unit && value.unit.length > 0 ? value.unit[0].rent : 0,
      })),
    );

    const unpaidTotal = unpaidRentAmount.reduce((acc, invoice) => {
      return acc + invoice.reduce((innerAcc, item) => innerAcc + item.unitRent, 0);
    }, 0);

    const totalRentAmount = invoices.map((el) =>
      Object.entries(el.pBills || {}).map(([key, value]) => ({
        key,
        unitRent: value.unit && value.unit.length > 0 ? value.unit[0].rent : 0,
      })),
    );

    const totalRent = totalRentAmount.reduce((acc, invoice) => {
      return acc + invoice.reduce((innerAcc, item) => innerAcc + item.unitRent, 0);
    }, 0);

    return {
      unpaid: unpaidTotal,
      total: totalRent,
    };
  }, [invoices]);

  const { unpaid, total } = result || {};

  //Sum for Paid Amount
  const paid = total - unpaid;
  const rentCollectedProgress = (paid / (total || 1)) * 100;

  useEffect(() => {
    if (!data) {
      return;
    }
    //Total Tenants
    const occupiedUnits = data.filter((o) => o.tenantId);
    const numOfOccupiedUnits = occupiedUnits.length;
    setNumTenant(numOfOccupiedUnits);

    const mapTenantId = occupiedUnits.map((m) => m.tenantId);
    const uniqueTenantIds = [...new Set(mapTenantId)];
    const eachUniqueIds = uniqueTenantIds.length;
    const totalTenantRatio = (eachUniqueIds / (numOfOccupiedUnits || 1)) * 100;
    setTenantInProgress(totalTenantRatio);

    //Occupied Units
    const totalUnits = data.length;
    setTotalUnits(totalUnits);

    const occupiedRatio = (numOfOccupiedUnits / (totalUnits || 1)) * 100;
    setOccupiedInProgress(occupiedRatio);

    //Vaccant Units
    const numOfVaccant = data.filter((v) => !v.tenantAgreementId);
    const lengthForVaccant = numOfVaccant.length;
    setNumVaccant(lengthForVaccant);

    const vaccantUnitRatio = (lengthForVaccant / (totalUnits || 1)) * 100;
    setVaccantInProgress(vaccantUnitRatio);
  }, [data]);

  //For Rent widgit
  useEffect(() => {
    const contentLength = paid.toString().length;

    if (contentLength >= 7) {
      setFontSize("19px");
    } else if (contentLength >= 5) {
      setFontSize("23px");
    } else {
      setFontSize("40px");
    }
  }, [paid]);

  const IconProgressBar = ({ icon, percent }) => {
    const format = () => <span>{icon}</span>;

    return <Progress format={format} type="circle" percent={percent} />;
  };

  return (
    <>
      <Row gutter={[16, 16]} className={styles.rowHeight}>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={32} xl={12}>
          <Card className={styles.circleCard}>
            <Title level={5} align="center">
              Total Tenants
            </Title>
            <IconProgressBar icon={<UserOutlined />} percent={tenantInProgress} />
            <br />
            <Row align="center">
              <Text style={{ fontSize: "40px" }} align="center">
                {numTenant || 0}
              </Text>
            </Row>
          </Card>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={32} xl={12}>
          <Card className={styles.circleCard}>
            <Title level={5} align="center">
              Occupied Units
            </Title>
            <IconProgressBar icon={<HomeOutlined />} percent={occupiedInProgress} />
            <br />
            <Row align="center">
              <Text style={{ fontSize: "40px" }} align="center">
                {totalUnits || 0}
              </Text>
            </Row>
          </Card>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={32} xl={12}>
          <Card className={styles.circleCard}>
            <Title level={5} align="center">
              Vacant Units
            </Title>
            <IconProgressBar icon={<KeyOutlined />} percent={vaccantInProgress} />
            <br />
            <Row align="center">
              <Text style={{ fontSize: "40px" }} align="center">
                {numVaccant || 0}
              </Text>
            </Row>
          </Card>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={32} xl={12}>
          <Card className={styles.circleCard}>
            <Title level={5} align="center">
              Rent Collected
            </Title>
            <IconProgressBar icon={<TagsOutlined />} percent={rentCollectedProgress} />
            <br />
            <Row align="center">
              <Text style={{ fontSize }} align="center">
                {convertToBD(paid || 0)}
              </Text>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ResidentialWidget;
