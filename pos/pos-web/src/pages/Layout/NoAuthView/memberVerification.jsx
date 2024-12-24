import { useMemberDetails } from "@/api/useMemberDetails";
import { DATE_FORMAT } from "@/constants/dateFormat";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Image, Row, Space, Spin, Table, Typography } from "antd";
import moment from "moment";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import logo from "../../../images/Property_icon.png";
import FetchFileView from "@/components/FetchFile/fetchFileView";
import { FetchProfileImage } from "@/components/FetchFile/fetchProfileImage";
const { Title, Text, Paragraph } = Typography;

export const MemberVerification = () => {
  const { id } = useParams();
  const { status, data } = useMemberDetails(id);
  const tableData = useMemo(() => {
    if (data) {
      const nTableData = [
        { key: 1, name: "Member ID", value: data.id },
        { key: 2, name: "Name", value: `${data.firstName} ${data.lastName || ""}` },
        { key: 3, name: "Date of Birth", value: moment(data.DOB).format(DATE_FORMAT) },
        { key: 4, name: "NID", value: data.nid || "N/A" },
        { key: 5, name: "Birth Certificate", value: data.birthCertificate || "N/A" },
        { key: 6, name: "Phone", value: data.mobile || "N/A" },
        { key: 7, name: "Blood Group", value: data.bloodGroup || "N/A" },
      ];
      if (data.property?.type === "commercial") {
        nTableData.push({ key: 8, name: "Shop Name", value: data.shopNames });
      } else {
        nTableData.push({ key: 8, name: "Unit Name", value: data.unitNames });
      }
      return nTableData;
    } else return [];
  }, [data]);
  const columns = [
    {
      title: "Field Name",
      dataIndex: "name",
    },
    {
      title: "Field value",
      dataIndex: "value",
    },
  ];
  if (status === "loading") {
    return (
      <div className={"spin"}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card>
      <Row gutter={[14, 0]} justify="center">
        <Col>
          {/* <img style={{ width: "120px", height: "auto" }} src={data.property?.propertyImage} /> */}
          <FetchFileView storagePath={data.property?.propertyImage} />
        </Col>
        <Col
          style={{ marginTop: "20px" }}
          xs={{ offset: 4 }}
          sm={{ offset: 0 }}
          md={{ offset: 0 }}
          lg={{ offset: 0 }}
          xl={{ offset: 0 }}
        >
          <Space direction="vertical" size={0}>
            <Title level={3} style={{ marginBottom: 0 }}>
              {data.property?.name || ""}
            </Title>
            <Text>{data.property?.address}</Text>
          </Space>
        </Col>
      </Row>
      <div style={{ margin: "18px 7px 7px 7px" }}>
        <Title align="center" level={4}>{`This Id is assigned to following member of ${
          data.property?.name || ""
        }`}</Title>
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: "17px",
          fontWeight: "bold",
          backgroundColor: "#E4E4E4",
        }}
      >
        Beneficiary Details
      </div>
      <div
        style={{
          textAlign: "center",
          margin: "7px",
        }}
      >
        <Row justify="center">
          <Col>
            <FetchProfileImage storagePath={data.profileImage} />
          </Col>
        </Row>
      </div>
      <Row justify="center">
        <Col xs={24} sm={24} md={18} lg={16} xl={12}>
          <Table
            size="small"
            showHeader={false}
            bordered
            columns={columns}
            dataSource={tableData}
            pagination={false}
          />
        </Col>
      </Row>
      <div
        style={{
          textAlign: "center",
          margin: "8px 10% 4px 10%",
        }}
      >
        <Paragraph>
          {`For any further assistance, please ${
            data.property?.name ? `visit ${data.property?.name} or` : ""
          } Email: anannyashopping
          complex@gmail.com`}
        </Paragraph>
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: "17px",
          fontWeight: "bold",
          backgroundColor: "#E4E4E4",
          // margin: "0px 4px 0px 4px",
          margin: "0px",
        }}
      >
        In Cooperation With
      </div>
      <div style={{ textAlign: "center", margin: "8px" }}>
        <Image src={logo} width={100} />
      </div>
    </Card>
  );
};
export default MemberVerification;
