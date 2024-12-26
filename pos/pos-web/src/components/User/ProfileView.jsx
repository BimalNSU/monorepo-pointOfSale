import { useState, useEffect } from "react";
import styles from "./Personal.module.css";
import { useNavigate, Link } from "react-router-dom";
import {
  Tabs,
  Button,
  Typography,
  Divider,
  Row,
  Col,
  Table,
  Spin,
  Space,
  Card,
  Result,
} from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { postCodeData } from "../../pmsData/postCode";
// import OwnerUnitsNParkings from "./ProfileViewSubComponents/OwnerUnitsNParkings";
// import TenantUnitsNParkings from "./ProfileViewSubComponents/TenantUnitsNParkings";
import FullViewPersonalInfo from "./ProfileViewSubComponents/PersonalInfo/FullViewPersonalInfo";
import ShortViewPersonalInfo from "./ProfileViewSubComponents/PersonalInfo/ShortViewPersonalInfo";
import FetchFile from "../FetchFile/FetchFile";
import { useUserProfile } from "@/api/useUserProfile";
const postOfficeList = Object.freeze(postCodeData);
const { Title } = Typography;

const columns = [
  {
    title: "File Name",
    dataIndex: "fileName",
    defaultSortOrder: "descend",
    render: (text) => {
      if (!text) {
        return "N/A";
      }
      return text;
    },
  },
  {
    title: "Title",
    dataIndex: "title",
    render: (text) => {
      if (!text) {
        return "N/A";
      }
      return text;
    },
  },
  {
    title: "Type",
    dataIndex: "type",
  },
  {
    title: "Link",
    dataIndex: "link",
    render: (text) => {
      if (!text) {
        return "N/A";
      }
      return text;
    },
  },
];
const { TabPane } = Tabs;
const ProfileView = ({ userId, role, currentPropertyId, isAdmin, authUserId }) => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const { status, data: uData } = useUserProfile(userId);

  useEffect(() => {
    if (!uData) {
      return;
    }
    const files = uData.files; //TODO: handle undefine "files"
    const fileNames = Object.keys(files);
    const nTableData = fileNames
      .filter((name) => files[name])
      .map((name, index) => {
        return {
          key: index,
          fileName: files[name].split("/")[2],
          title: files[name].split("/")[2].split(".")[0],
          type: name,
          link: <FetchFile storagePath={files[name]} />,
        };
      });
    setTableData(nTableData);
    // const stack = [];
    // if (uData.uploadBirth) {
    //   stack.push({
    //     key: 1,
    //     fileName: uData.uploadBirth.split("/")[2],
    //     title: uData.uploadBirth.split("/")[2].split(".")[0],
    //     type: "Birth Certificate",
    //     link: <FetchFile storagePath={uData?.uploadBirth} />,
    //   });
    // }
    // if (uData.uploadTin) {
    //   stack.push({
    //     key: 2,
    //     fileName: uData.uploadTin.split("/")[2],
    //     title: uData.uploadTin.split("/")[2].split(".")[0],
    //     type: "TIN",
    //     link: <FetchFile storagePath={uData?.uploadTin} />,
    //   });
    // }
    // if (uData.uploadNID) {
    //   stack.push({
    //     key: 3,
    //     fileName: uData?.uploadNID.split("/")[2],
    //     title: uData?.uploadNID.split("/")[2].split(".")[0],
    //     type: "NID",
    //     link: <FetchFile storagePath={uData?.uploadNID} />,
    //   });
    // }
    // if (uData.uploadVAT) {
    //   stack.push({
    //     key: 4,
    //     fileName: uData.uploadVAT.split("/")[2],
    //     title: uData?.uploadVAT.split("/")[2].split(".")[0],
    //     type: "VAT",
    //     link: <FetchFile storagePath={uData?.uploadVAT} />,
    //   });
    // }
    // if (uData.uploadPassport) {
    //   stack.push({
    //     key: 5,
    //     fileName: uData.uploadPassport.split("/")[2],
    //     title: uData.uploadPassport.split("/")[2].split(".")[0],
    //     type: "Passport",
    //     link: <FetchFile storagePath={uData?.uploadPassport} />,
    //   });
    // }
    // if (uData.uploadTradeLicense) {
    //   stack.push({
    //     key: 5,
    //     fileName: uData.uploadTradeLicense.split("/")[2],
    //     title: uData.uploadTradeLicense.split("/")[2].split(".")[0],
    //     type: "Trade License",
    //     link: <FetchFile storagePath={uData?.uploadTradeLicense} />,
    //   });
    // }
    // if (uData.otherFiles) {
    //   stack.push({
    //     key: 6,
    //     fileName: uData.otherFiles.split("/")[2],
    //     title: uData.otherFiles.split("/")[2].split(".")[0],
    //     type: "Others",
    //     link: <FetchFile storagePath={uData?.otherFiles} />,
    //   });
    // }

    // setTableData(stack);
  }, [uData]);

  if (status === "loading") {
    return (
      <div className={`spin`}>
        <Spin size="large" />
      </div>
    );
  }
  if (status === "error" || !uData) {
    return (
      <Result
        status="error"
        title="Invalid data fetching request..!"
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        }
      />
    );
  }

  // DOB conversion for ANT design
  // const timestamp =  uData?.DOB.seconds
  // let date = new Date(timestamp)
  // const dob = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`
  //   const timestamp = data ? uData?.DOB.seconds : null;
  //   const dob = dayjs(timestamp).format(dateFormat).toString();

  // const { uploadBirth, uploadNID, uploadTin, uploadVAT, otherFiles, updatedAt, createdAt } = data
  // const createAt = dayjs(createdAt).format(dateFormat).toString()
  const generateAddress = () => {
    const postOfficeObject = postOfficeList.find(
      (postOffice) => postOffice.postCode === Number(uData.address.postOffice),
    );
    const postOffice = postOfficeObject
      ? `${postOfficeObject.subOffice} - ${postOfficeObject.postCode}`
      : null;
    const addressPart1 = `${uData.address.house}, ${uData.address.village_road},`;
    const tempAddressPart2 = uData.address.block_sector_area || uData.address.avenue || "";
    const addressPart2 = tempAddressPart2 ? `${tempAddressPart2},` : "";
    const addressPart3 = uData.address.upazila
      ? uData.address.union
        ? `${uData.address.union}, ${uData.address.upazila},`
        : `${uData.address.upazila},`
      : `${
          uData.address.cc_m_c ? `${uData.address.cc_m_c.value}, ${uData.address.cc_m_c.type},` : ""
        }`;
    const addressPart4 = `${uData.address.district}, ${postOffice}, ${uData.address.thana}, ${uData.address.division_state}`;
    return ` ${addressPart1}${addressPart2}${addressPart3}${addressPart4}`;
  };
  return (
    <div>
      <Button shape="circle" onClick={() => navigate(-1)} style={{ fontSize: 15 }}>
        <ArrowLeftOutlined />
      </Button>
      <Row style={{ marginTop: 10 }}>
        <Title level={5}>Profile</Title>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={4} lg={4} xl={4}>
          {uData && uData.profileImage ? <FetchFile storagePath={uData?.profileImage} /> : null}
        </Col>
        {/* <img className={styles.profile_img} src="images/faces/face27.jpg" alt="" /> */}
        <Col xs={24} sm={24} md={20} lg={20} xl={20}>
          <Space direction="horizontal">
            <Title level={4}> {`${uData?.firstName} ${uData?.lastName}`} </Title>
            {!isAdmin && userId === authUserId ? (
              <Link to="/profile/edit">
                <EditOutlined />
              </Link>
            ) : null}
          </Space>
          {/* </Space> */}

          <Title level={5}>
            {role ? role : ""}
            {isAdmin ? `| ${!uData?.address ? "N/A" : generateAddress()}` : null}
          </Title>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1" style={{ marginBottom: 32 }} size={"large"}>
        <TabPane tab="Info." key="1">
          <Title level={4} style={{ marginTop: 20 }}>
            Contact informations
          </Title>
          <Divider direction="horizontal" style={{ margin: 10 }} />
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <Title level={5}>Email</Title>
              <p>{uData?.email}</p>
              <a href="#" className={styles.a_link}>
                <i>
                  {/* <img className={styles.icon} src={envelope} />{" "} */}
                  <span className={styles.icon_text}>Compose Email</span>{" "}
                </i>
              </a>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1} xl={1}>
              <Divider type="vertical" style={{ height: "100px", backgroundColor: "#000" }} />
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <Title level={5}>Phone</Title>
              <p>{uData?.mobile}</p>
            </Col>

            {isAdmin ? (
              <>
                <Col xs={0} sm={0} md={1} lg={1} xl={1}>
                  <Divider type="vertical" style={{ height: "100px", backgroundColor: "#000" }} />
                </Col>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  <Title level={5}>Address</Title>
                  {/* <p>{uData?.presentAddress}</p> */}
                  <Space direction="vertical" size={1}>
                    <Space size={20}>
                      {/* <p>District: {data && uData.address?.district ? uData.address.district : "N/A"}</p>
                  <p>Thana: {data && uData.address?.thana ? uData.address.thana : "N/A"} </p>
                  <p>Post Code: {data && uData.address?.postCode ? uData.address.postCode : "N/A"}</p> */}
                    </Space>
                    <p>{!uData?.address ? "N/A" : generateAddress()}</p>
                  </Space>
                </Col>
              </>
            ) : null}
          </Row>
          <Title level={4}>Personal informations</Title>
          <Divider style={{ margin: 1 }} />
          {isAdmin || userId === authUserId ? (
            <FullViewPersonalInfo data={uData} />
          ) : (
            <ShortViewPersonalInfo data={uData} />
          )}
          <Title level={4}>Emergency Contact</Title>
          <Divider style={{ margin: 1 }} />
          <Row gutter={[10, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={24} md={12} lg={8} xl={10}>
              <Row>
                <Col span={12}>
                  <p className={`${styles.label_table}`}>Email:</p>
                </Col>
                <Col span={12}>
                  <p className={`${styles.text_table}`}>
                    {uData && uData.emergencyEmail ? uData.emergencyEmail : "N/A"}
                  </p>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={8} lg={6} xl={10} className={` `}>
              <Row>
                <Col span={12}>
                  <p className={`${styles.label_table}`}>Contact No:</p>
                </Col>
                <Col span={12}>
                  <p className={`${styles.text_table}`}>
                    {uData && uData.emergencyMobile ? uData.emergencyMobile : "N/A"}
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
          <Title level={4}>Created By</Title>
          <Divider style={{ margin: 1 }} />
          <Row gutter={[10, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={24} md={12} lg={8} xl={10}>
              <Row>
                <Col span={12}>
                  <p className={`${styles.label_table}`}>
                    {uData && uData.createdBy && uData.createdBy === uData.uid ? uData.uid : null}
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </TabPane>
        {role !== "manager" ? (
          <TabPane tab="Details" key="2">
            <Card>
              {/* {role === "owner" ? (
                <OwnerUnitsNParkings
                  ownerId={userId}
                  assignmentList={uData.assignmentList}
                  // currentPropertyId={currentPropertyId}
                  authUserId={authUserId}
                  isAdmin={isAdmin}
                  currentPropertyId={currentPropertyId}
                />
              ) : null}
              {role === "tenant" ? (
                <TenantUnitsNParkings
                  tenantId={userId}
                  tenantAssignmentList={uData.tenantAssignmentList}
                  // currentPropertyId={currentPropertyId}
                  authUserId={authUserId}
                  isAdmin={isAdmin}
                  currentPropertyId={currentPropertyId}
                />
              ) : null} */}
            </Card>
          </TabPane>
        ) : null}
        {isAdmin || userId === authUserId ? (
          <TabPane tab="Files" key={role !== "manager" ? "3" : "2"}>
            <div className={`border p-3 rounded`}>
              <Table columns={columns} dataSource={tableData} />
            </div>
          </TabPane>
        ) : null}
      </Tabs>
    </div>
  );
};
export default ProfileView;
