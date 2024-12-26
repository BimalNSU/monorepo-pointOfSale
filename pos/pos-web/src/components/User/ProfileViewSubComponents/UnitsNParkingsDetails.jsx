import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import styles from "../Personal.module.css";
import { useNavigate, useParams, Link } from "react-router-dom";
// import envelope from "../../../images/envelope.png"
import {
  Tabs,
  Modal,
  Form,
  Upload,
  Menu,
  Button,
  Typography,
  message,
  Divider,
  Row,
  Col,
  Table,
  Dropdown,
  Select,
  Spin,
  Space,
  Card,
} from "antd";
import {
  DownOutlined,
  FilePdfOutlined,
  UploadOutlined,
  LeftCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  doc,
  getFirestore,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import {
  FirebaseAppProvider,
  FirestoreProvider,
  useFirestoreDocData,
  useStorage,
  useStorageDownloadURL,
  useFirestore,
  useFirestoreCollectionData,
  useStorageTask,
  useFirebaseApp,
} from "reactfire";
import { ref, uploadBytesResumable, getStorage } from "firebase/storage";
import { COLLECTIONS } from "@/constants/collections";

const { Text } = Typography;
const dateFormat = "DD/MM/YYYY";
const { Title } = Typography;
const columns = [
  {
    title: "File Name",
    dataIndex: "fileName",
    defaultSortOrder: "descend",
  },
  {
    title: "Title",
    dataIndex: "title",
  },

  {
    title: "Link",
    dataIndex: "link",
  },
];
const { TabPane } = Tabs;
const UnitsNParkingsDetails = (props) => {
  const unitNParkingData = props.unitNParkingData;
  //   const { value, loading } = usePromise(props.data);
  //   const [result, error, state] = usePromise(props.data);
  //   const [unitData, setUnitData] = useState([])
  //   const role = props.role;
  const navigate = useNavigate();

  //   const storage = useStorage();
  //   const params = useParams();
  //   const firestore = useFirestore();
  //   const [tableData, setTableData] = useState([]);
  // const userId = params.id
  //   const collectionRef = = collection(firestore, role === "owner" ? COLLECTIONS.tenantAgreements || role === "tenant" ? COLLECTIONS.ownerUnitAssignments : "" : "");
  // //   const { status, data } = useFirestoreDocData(collectionRef);
  // const q = query(
  //     collectionRef,
  //     // where("managerUid", "==", authUserId),
  //     where("isRevoked", "==", false)
  //   );
  //   useEffect(() => {
  //     const stack = [];
  //     if (!data) {
  //       return;
  //     }
  //     if (data.uploadBirth) {
  //       stack.push({
  //         key: 1,
  //         fileName: data.uploadBirth.split("/")[1],
  //         title: data.uploadBirth.split("/")[1].split(".")[0],
  //         link: <FetchFile storagePath={data?.uploadBirth} />,
  //       });
  //     }
  //     if (data.uploadTin) {
  //       stack.push({
  //         key: 2,
  //         fileName: data.uploadTin.split("/")[1],
  //         title: data.uploadTin.split("/")[1].split(".")[0],
  //         link: <FetchFile storagePath={data?.uploadTin} />,
  //       });
  //     }
  //     if (data.uploadNID) {
  //       stack.push({
  //         key: 3,
  //         fileName: data?.uploadNID.split("/")[1],
  //         title: data?.uploadNID.split("/")[1].split(".")[0],
  //         link: <FetchFile storagePath={data?.uploadNID} />,
  //       });
  //     }
  //     if (data.uploadVAT) {
  //       stack.push({
  //         key: 4,
  //         fileName: data.uploadVAT.split("/")[1],
  //         title: data?.uploadVAT.split("/")[1].split(".")[0],
  //         link: <FetchFile storagePath={data?.uploadVAT} />,
  //       });
  //     }
  //     if (data.otherFiles) {
  //       stack.push({
  //         key: 5,
  //         fileName: data.otherFiles.split("/")[1],
  //         title: data.otherFiles.split("/")[1].split(".")[0],
  //         link: <FetchFile storagePath={data?.otherFiles} />,
  //       });
  //     }
  //     setTableData(stack);
  //   }, [data]);
  //   if (status === "loading") {
  //     return (
  //       <div className={`spin`}>
  //         <Spin size="large" />
  //       </div>
  //     );
  //   if (state === "pending") {
  //     return <p>{state}</p>;
  //   }
  //   console.log("props.data", props.data);
  // if (!data?.length) {
  //   return <p>no data</p>;
  // }

  // const [unitNParkingData, setUnitNParkingtData] = useState([]);

  if (!unitNParkingData.length) {
    return <p>No data found</p>;
  }

  return (
    <>
      {unitNParkingData.map((property, index) => (
        <Card
          style={{
            marginTop: 16,
          }}
          type="inner"
          key={index}
        >
          <Title level={4}>Property ref.</Title>
          <Divider style={{ margin: 1 }} />
          <Row gutter={[1, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={24} md={8}>
              <Space direction="vertical">
                <Text>Property Id</Text>
                <Typography level={5}>{property.propertyId}</Typography>
              </Space>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Space direction="vertical">
                <Text>Property Name</Text>
                <Typography level={3}>{property.name}</Typography>
              </Space>
            </Col>
          </Row>

          {property.units.length ? (
            <>
              <Title level={4}>Unit Details.</Title>
              <Divider style={{ margin: 1 }} />
              {property.units.map((unit, i) => (
                <Row key={i} gutter={[1, 24]} style={{ marginBottom: 24 }}>
                  <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                    <Space direction="vertical">
                      <Text>UNIT NO.</Text>
                      <Typography level={5}>{unit.unitNo}</Typography>
                    </Space>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                    <Space direction="vertical">
                      <Text>UNIT SIZE</Text>
                      <Typography level={5}>{unit.size ? unit.size : "N/A"}</Typography>
                    </Space>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                    <Space direction="vertical">
                      <Text>BEDS</Text>
                      <Typography level={5}>{unit.beds ? unit.beds : "N/A"}</Typography>
                    </Space>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                    <Space direction="vertical">
                      <Text>BATHS</Text>
                      <Typography level={5}>{unit.baths ? unit.baths : "N/A"}</Typography>
                    </Space>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                    <Space direction="vertical">
                      <Text>BALCONY</Text>
                      <Typography level={5}>{unit.balcony ? unit.balcony : "N/A"}</Typography>
                    </Space>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                    <Space direction="vertical">
                      <Text>FACING</Text>
                      <Typography level={5}>{unit.facing ? unit.facing : "N/A"}</Typography>
                    </Space>
                  </Col>
                </Row>
              ))}
            </>
          ) : null}

          {property.parkingLots.length ? (
            <>
              <Title level={4}>Parking Details.</Title>
              <Divider style={{ margin: 1 }} />
              {property.parkingLots.map((parkingLot, i) => (
                <Row key={i} gutter={[1, 24]} style={{ marginBottom: 24 }}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Space direction="vertical">
                      <Text>ParkingLot No.</Text>
                      <Typography level={5}>{parkingLot.no}</Typography>
                    </Space>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Space direction="vertical">
                      <Text>Type</Text>
                      <Typography level={5}>{parkingLot.type ? parkingLot.type : "N/A"}</Typography>
                    </Space>
                  </Col>
                </Row>
              ))}
            </>
          ) : null}
        </Card>
      ))}
    </>
  );
};
export default UnitsNParkingsDetails;
