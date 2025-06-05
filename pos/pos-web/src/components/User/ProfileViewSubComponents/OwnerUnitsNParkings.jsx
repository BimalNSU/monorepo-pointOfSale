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
import { COLLECTIONS } from "@pos/shared-models";
import UnitsNParkingsDetails from "./UnitsNParkingsDetails";

const { Text } = Typography;
const dateFormat = "DD/MM/YYYY";
const { Title } = Typography;

const { TabPane } = Tabs;
const OwnerUnitsNParkings = ({
  ownerId,
  assignmentList,
  authUserId,
  isAdmin,
  currentPropertyId,
}) => {
  const navigate = useNavigate();

  const firestore = useFirestore();
  const [unitNParkingData, setUnitNParkingtData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchDataHelper = async (propertyId, unitIds, parkingIds) => {
    const docRef = doc(firestore, COLLECTIONS.properties, propertyId);
    const docSnap = await getDoc(docRef);
    const propertyData = docSnap.data();
    if (docSnap.exists()) {
      // const unitIds = item[1].unitIds ? item[1].unitIds : [];
      // const parkingIds = item[1].parkingIds ? item[1].parkingIds : [];
      const units = unitIds.length
        ? await Promise.all(
            unitIds.map(async (unitId) => {
              const residentialDocRef = doc(
                firestore,
                `${COLLECTIONS.properties}/${propertyId}/${COLLECTIONS.residentials}/${unitId}`,
              );
              const residentialDocSnap = await getDoc(residentialDocRef);
              return { unitId, ...residentialDocSnap.data() };
            }),
          )
        : [];

      const parkingLots = parkingIds.length
        ? await Promise.all(
            parkingIds.map(async (parkingId) => {
              const parkingLotDocRef = doc(
                firestore,
                `${COLLECTIONS.properties}/${propertyId}/${COLLECTIONS.parkingLots}/${parkingId}`,
              );
              const parkingLotDocSnap = await getDoc(parkingLotDocRef);
              return { parkingId, ...parkingLotDocSnap.data() };
            }),
          )
        : [];

      return {
        ["propertyId"]: propertyId,
        ["name"]: propertyData.name,
        units,
        parkingLots,
      };
    }

    // return new Promise(async (res, rej) => {
    //   const docRef = doc(firestore, COLLECTIONS.properties, propertyId);
    //   const docSnap = await getDoc(docRef);
    //   const propertyData = docSnap.data();
    //   if (docSnap.exists()) {
    //     // const unitIds = item[1].unitIds ? item[1].unitIds : [];
    //     // const parkingIds = item[1].parkingIds ? item[1].parkingIds : [];
    //     const units = unitIds.length
    //       ? await Promise.all(
    //           unitIds.map(async (unitId) => {
    //             const residentialDocRef = doc(
    //               firestore,
    //               `${COLLECTIONS.properties}/${propertyId}/${COLLECTIONS.residentials}/${unitId}`,
    //             );
    //             const residentialDocSnap = await getDoc(residentialDocRef);
    //             return { unitId, ...residentialDocSnap.data() };
    //           }),
    //         )
    //       : [];

    //     const parkingLots = parkingIds.length
    //       ? await Promise.all(
    //           parkingIds.map(async (parkingId) => {
    //             const parkingLotDocRef = doc(
    //               firestore,
    //               `${COLLECTIONS.properties}/${propertyId}/${COLLECTIONS.parkingLots}/${parkingId}`,
    //             );
    //             const parkingLotDocSnap = await getDoc(parkingLotDocRef);
    //             return { parkingId, ...parkingLotDocSnap.data() };
    //           }),
    //         )
    //       : [];

    //     res({
    //       ["propertyId"]: propertyId,
    //       ["name"]: propertyData.name,
    //       units,
    //       parkingLots,
    //     });
    //   } else {
    //     rej(new Error("value doesn't exist"));
    //   }
    // });
  };
  async function fetchData() {
    try {
      const stack = await Promise.all(
        isAdmin || ownerId === authUserId
          ? Object.entries(assignmentList || {}).map(
              async (item) =>
                await fetchDataHelper(item[0], item[1].unitIds || [], item[1].parkingIds || []),
              // FIX: no async promise executor
              // eslint-disable-next-line no-async-promise-executor
              // new Promise(async (res, rej) => {
              //   const propertyId = item[0];
              //   const docRef = doc(firestore, COLLECTIONS.properties, propertyId);
              //   const docSnap = await getDoc(docRef);
              //   const propertyData = docSnap.data();
              //   if (docSnap.exists()) {
              //     const unitIds = item[1].unitIds ? item[1].unitIds : [];
              //     const parkingIds = item[1].parkingIds ? item[1].parkingIds : [];
              //     const units = unitIds.length
              //       ? await Promise.all(
              //           unitIds.map(async (unitId) => {
              //             const residentialDocRef = doc(
              //               firestore,
              //               `${COLLECTIONS.properties}/${propertyId}/${COLLECTIONS.residentials}/${unitId}`,
              //             );
              //             const residentialDocSnap = await getDoc(residentialDocRef);
              //             return { unitId, ...residentialDocSnap.data() };
              //           }),
              //         )
              //       : [];

              //     const parkingLots = parkingIds.length
              //       ? await Promise.all(
              //           parkingIds.map(async (parkingId) => {
              //             const parkingLotDocRef = doc(
              //               firestore,
              //               `${COLLECTIONS.properties}/${propertyId}/${COLLECTIONS.parkingLots}/${parkingId}`,
              //             );
              //             const parkingLotDocSnap = await getDoc(parkingLotDocRef);
              //             return { parkingId, ...parkingLotDocSnap.data() };
              //           }),
              //         )
              //       : [];

              //     res({
              //       ["propertyId"]: propertyId,
              //       ["name"]: propertyData.name,
              //       units,
              //       parkingLots,
              //     });
              //   } else {
              //     rej(new Error("value doesn't exist"));
              //   }
              // }),
            )
          : currentPropertyId && assignmentList[currentPropertyId]
          ? [
              await fetchDataHelper(
                currentPropertyId,
                assignmentList[currentPropertyId].unitIds || [],
                assignmentList[currentPropertyId].parkingIds || [],
              ),
            ]
          : [],
      );
      setIsLoaded(true);
      setUnitNParkingtData(stack);
    } catch (err) {
      console.log("err", err);
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
  if (!unitNParkingData.length) {
    return <p>No data found</p>;
  }

  return <UnitsNParkingsDetails unitNParkingData={unitNParkingData} />;
};
export default OwnerUnitsNParkings;
