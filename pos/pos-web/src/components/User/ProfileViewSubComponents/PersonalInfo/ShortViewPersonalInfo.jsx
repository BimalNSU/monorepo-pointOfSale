import { Row, Col } from "antd";
import styles from "../../Personal.module.css";
import { RELIGION_TYPE } from "@/constants/religion";

const FullViewPersonalInfo = ({ data }) => {
  return (
    <Row gutter={[1, 24]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={24} md={8}>
        <Row>
          <Col span={12}>
            <p className={`${styles.label_table}`}>Religion:</p>
          </Col>
          <Col span={12}>
            <p className={`${styles.text_table}`}>
              {data.religion ? RELIGION_TYPE.KEYS[data.religion].text : "N/A"}
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <p className={`${styles.label_table}`}>Blood Group:</p>
          </Col>
          <Col span={12}>
            <p className={`${styles.text_table}`}>
              {data && data.bloodGroup ? data.bloodGroup : "N/A"}
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <p className={`${styles.label_table}`}>Gender:</p>
          </Col>
          <Col span={12}>
            <p className={`${styles.text_table}`}>
              {data && data.gender
                ? data.gender === 1
                  ? "Male"
                  : null || data.gender === 2
                  ? "Female"
                  : null || data.gender === 3
                  ? "Other"
                  : null
                : "N/A"}
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <p className={`${styles.label_table}`}>Occupation:</p>
          </Col>
          <Col span={12}>
            <p className={`${styles.text_table}`}>
              {data && data.occupation ? data.occupation : "N/A"}
            </p>
          </Col>
        </Row>
      </Col>
      <Col xs={24} sm={24} md={8}>
        <div className={`${styles.content}`}>
          <Row>
            <Col span={12}>
              <p className={`${styles.label_table}`}>Resident No.:</p>
            </Col>
            <Col span={12}>
              <p className={`${styles.text_table}`}>
                {data && data.residentsNo !== undefined ? data.residentsNo : "N/A"}
              </p>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};
export default FullViewPersonalInfo;
