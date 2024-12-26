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
import UnitsNParkingsDetails from "./UnitsNParkingsDetails";
import { getUnitsOfTenant, getParkingLotsOfTenant } from "@/api/admin/tenantFunctions";
const { Text } = Typography;
const dateFormat = "DD/MM/YYYY";
const { Title } = Typography;
// const columns = [
//   {
//     title: "File Name",
//     dataIndex: "fileName",
//     defaultSortOrder: "descend",
//   },
//   {
//     title: "Title",
//     dataIndex: "title",
//   },

//   {
//     title: "Link",
//     dataIndex: "link",
//   },
// ];
const { TabPane } = Tabs;
const TenantUnitsNParkings = ({
  tenantId,
  tenantAssignmentList,
  authUserId,
  isAdmin,
  currentPropertyId,
}) => {
  //   const data = props.data;
  //   const userId = props.userId
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
  const firestore = useFirestore();
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchDataHelper = async (propertyId) => {
    // const propertyId = item[0];
    const docRef = doc(firestore, COLLECTIONS.properties, propertyId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // const units = docSnap
      //   .data()
      //   .residential.filter((unit) =>
      //     ownerUnitAssignmentsData.find((ownerUnit) => ownerUnit.unitId === unit.unitId)
      //   );
      // const agreementIds = item[1].agreementIds ? item[1].agreementIds : [];
      // const parkingIds = item[1].parkingIds ? item[1].parkingIds : [];
      // const units = unitIds.length
      //   ? await Promise.all(
      //       unitIds.map(async (unitId) => {
      //         const residentialDocRef = doc(
      //           firestore,
      //           `${COLLECTIONS.properties}/${propertyId}/${COLLECTIONS.residentials}/${unitId}`
      //         );
      //         const residentialDocSnap = await getDoc(residentialDocRef);
      //         return { unitId, ...residentialDocSnap.data() };
      //       })
      //     )
      //   : [];
      // const parkingLots = parkingIds.length
      //   ? await Promise.all(
      //       parkingIds.map(async (parkingId) => {
      //         const parkingLotDocRef = doc(
      //           firestore,
      //           `${COLLECTIONS.properties}/${propertyId}/${COLLECTIONS.parkingLots}/${parkingId}`
      //         );
      //         const parkingLotDocSnap = await getDoc(parkingLotDocRef);
      //         return { parkingId, ...parkingLotDocSnap.data() };
      //       })
      //     )
      //   : [];
      const units = await getUnitsOfTenant(firestore, propertyId, tenantId);
      const parkingLots = await getParkingLotsOfTenant(firestore, propertyId, tenantId);
      return {
        ["propertyId"]: propertyId,
        ["name"]: docSnap.data().name,
        units,
        parkingLots,
      };
    }
    // return new Promise(async (res, rej) => {
    //   // const propertyId = item[0];
    //   const docRef = doc(firestore, COLLECTIONS.properties, propertyId);
    //   const docSnap = await getDoc(docRef);
    //   if (docSnap.exists()) {
    //     // const units = docSnap
    //     //   .data()
    //     //   .residential.filter((unit) =>
    //     //     ownerUnitAssignmentsData.find((ownerUnit) => ownerUnit.unitId === unit.unitId)
    //     //   );
    //     // const agreementIds = item[1].agreementIds ? item[1].agreementIds : [];
    //     // const parkingIds = item[1].parkingIds ? item[1].parkingIds : [];
    //     // const units = unitIds.length
    //     //   ? await Promise.all(
    //     //       unitIds.map(async (unitId) => {
    //     //         const residentialDocRef = doc(
    //     //           firestore,
    //     //           `${COLLECTIONS.properties}/${propertyId}/${COLLECTIONS.residentials}/${unitId}`
    //     //         );
    //     //         const residentialDocSnap = await getDoc(residentialDocRef);
    //     //         return { unitId, ...residentialDocSnap.data() };
    //     //       })
    //     //     )
    //     //   : [];
    //     // const parkingLots = parkingIds.length
    //     //   ? await Promise.all(
    //     //       parkingIds.map(async (parkingId) => {
    //     //         const parkingLotDocRef = doc(
    //     //           firestore,
    //     //           `${COLLECTIONS.properties}/${propertyId}/${COLLECTIONS.parkingLots}/${parkingId}`
    //     //         );
    //     //         const parkingLotDocSnap = await getDoc(parkingLotDocRef);
    //     //         return { parkingId, ...parkingLotDocSnap.data() };
    //     //       })
    //     //     )
    //     //   : [];
    //     const units = await getUnitsOfTenant(firestore, propertyId, tenantId);
    //     const parkingLots = await getParkingLotsOfTenant(firestore, propertyId, tenantId);
    //     res({
    //       ["propertyId"]: propertyId,
    //       ["name"]: docSnap.data().name,
    //       units,
    //       parkingLots,
    //     });
    //   }
    //   rej(new Error("value doesn't exist"));
    // });
  };
  async function fetchData() {
    try {
      const stack = await Promise.all(
        isAdmin || tenantId === authUserId
          ? Object.entries(tenantAssignmentList || {}).map(
              async (item) => await fetchDataHelper(item[0]),
              // FIX: async promise executor
              // eslint-disable-next-line no-async-promise-executor
              // new Promise(async (res, rej) => {
              //   const propertyId = item[0];
              //   const docRef = doc(firestore, COLLECTIONS.properties, propertyId);
              //   const docSnap = await getDoc(docRef);
              //   if (docSnap.exists()) {
              //     // const units = docSnap
              //     //   .data()
              //     //   .residential.filter((unit) =>
              //     //     ownerUnitAssignmentsData.find((ownerUnit) => ownerUnit.unitId === unit.unitId)
              //     //   );
              //     // const agreementIds = item[1].agreementIds ? item[1].agreementIds : [];
              //     // const parkingIds = item[1].parkingIds ? item[1].parkingIds : [];
              //     // const units = unitIds.length
              //     //   ? await Promise.all(
              //     //       unitIds.map(async (unitId) => {
              //     //         const residentialDocRef = doc(
              //     //           firestore,
              //     //           `${COLLECTIONS.properties}/${propertyId}/${COLLECTIONS.residentials}/${unitId}`
              //     //         );
              //     //         const residentialDocSnap = await getDoc(residentialDocRef);
              //     //         return { unitId, ...residentialDocSnap.data() };
              //     //       })
              //     //     )
              //     //   : [];

              //     // const parkingLots = parkingIds.length
              //     //   ? await Promise.all(
              //     //       parkingIds.map(async (parkingId) => {
              //     //         const parkingLotDocRef = doc(
              //     //           firestore,
              //     //           `${COLLECTIONS.properties}/${propertyId}/${COLLECTIONS.parkingLots}/${parkingId}`
              //     //         );
              //     //         const parkingLotDocSnap = await getDoc(parkingLotDocRef);
              //     //         return { parkingId, ...parkingLotDocSnap.data() };
              //     //       })
              //     //     )
              //     //   : [];
              //     const units = await getUnitsOfTenant(firestore, propertyId, userId);
              //     const parkingLots = await getParkingLotsOfTenant(firestore, propertyId, userId);
              //     res({
              //       ["propertyId"]: propertyId,
              //       ["name"]: docSnap.data().name,
              //       units,
              //       parkingLots,
              //     });
              //   }
              //   rej(new Error("value doesn't exist"));
              // }),
            )
          : currentPropertyId
          ? [await fetchDataHelper(currentPropertyId)]
          : [],
      );
      setIsLoaded(true);
      setAssignmentsData(stack);
    } catch (err) {
      // TODO: to be implemented
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!isLoaded) {
    return (
      <div className={`spin`}>
        <Spin size="default" />
      </div>
    );
  }
  if (!assignmentsData.length) {
    return <p>No data found</p>;
  }

  return <UnitsNParkingsDetails unitNParkingData={assignmentsData} />;
};
export default TenantUnitsNParkings;
