import { useCustomers } from "@/api/useCustomers";
import CustomerDataTable from "@/components/Customer/customerDataTable";
import { Button, Card, Col, Row } from "antd";
import { Link } from "react-router-dom";
import styles from "../../posButton.module.css";
import customAntdStyles from "../../customAntd.module.css";
import { PlusOutlined } from "@ant-design/icons";

const Customers = () => {
  const { status, data } = useCustomers({ isDeleted: false });
  return (
    <Card
      title={
        <Row justify="space-between">
          <Col style={{ fontSize: "16px" }}>Customer List</Col>
          <Col>
            <Link to="/customers/add">
              <Button className={styles.posBtn} icon={<PlusOutlined />}>
                Add Customer
              </Button>
            </Link>
          </Col>
        </Row>
      }
      variant="borderless"
      className={customAntdStyles.mobileCardBody}
    >
      <CustomerDataTable status={status} data={data} />
    </Card>
  );
};
export default Customers;
