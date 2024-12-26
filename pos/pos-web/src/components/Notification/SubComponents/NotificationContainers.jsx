import React, { useEffect, useState } from "react";
import {
  Form,
  Menu,
  Button,
  Input,
  message,
  Space,
  Row,
  Col,
  Select,
  Table,
  Dropdown,
  Modal,
  Tag,
  Spin,
  Typography,
  List,
  Image,
  Badge,
  Avatar,
  Popover,
  Divider,
} from "antd";
import dayjs from "dayjs";
import Icon, { DownOutlined, SearchOutlined, FilePdfOutlined } from "@ant-design/icons";

import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import {
  doc,
  getFirestore,
  updateDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  collection,
  documentId,
  orderBy,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  FirebaseAppProvider,
  FirestoreProvider,
  useFirestoreDocData,
  useFirestore,
  useFirestoreCollectionData,
  useFirebaseApp,
  useAuth,
  useStorage,
  useStorageDownloadURL,
} from "reactfire";
// import { error } from "../../../../utils/Utils/Utils";
import { COLLECTIONS } from "../../../constants/collections";
import { useMemo } from "react";
import { ButtonToolbar } from "react-bootstrap";
import { ref } from "firebase/storage";
import { useCustomAuth } from "../../../utils/hooks/customAuth";
// import notificationSvg from "path/to/message.svg"; // path to your '*.svg' file.
// import notificationSvg from "../../images/notification.svg";
import CategorizedNotificationContainer from "./SubComponents/CategorizedNotificationContainer";
// import InfiniteScroll from "react-infinite-scroll-component";
const { Text, Title } = Typography;
const { Option } = Select;
const dateTimeFormat = "DD/MM/YYYY, HH:mm:ss";
const dateFormat = "DD/MM/YYYY";
// const milisecDiffForYesterday = 86400000;
// const { confirm } = Modal;
// const currentDateTime = dayjs().format(dateTimeFormat); // result return as string format

const NotificationContainers = ({ data, numOfMaxNotification, onClickedHideNotification }) => {
  const { userId, role } = useCustomAuth();
  const firestore = useFirestore();
  const storage = useStorage();
  const [todayNotification, setTodayNotification] = useState();
  const [yesterdayNotification, setYesterdayNotification] = useState();
  const [earlierNotification, setEarlierNotification] = useState();

  // const handleNotification = async (notificationDocId) => {
  //   const notificationDocRef = doc(
  //     firestore,
  //     `${COLLECTIONS.users}/${userId}/${COLLECTIONS.notifications}/${notificationDocId}`
  //   );
  //   await updateDoc(notificationDocRef, {
  //     isRead: true,
  //   });
  // };

  useEffect(() => {
    const viewableNotifications = numOfMaxNotification
      ? data.slice(0, numOfMaxNotification)
      : [...data];
    // const viewableNotifications = [...data];
    const nTodayNotifications = [];
    const nYesterdayNotification = [];
    const nEarlierNotification = [];
    // const nowDate = dayjs().format("DD/MM/YYYY");
    const nowDateTime = dayjs().format(dateTimeFormat);
    // let numOfUnread = 0;
    viewableNotifications.forEach((item) => {
      // if (!item.isRead) {
      //   numOfUnread++;
      // }
      const { createdAt, ...rest } = item;
      const then = dayjs(createdAt.toDate()).format(dateTimeFormat);
      //   const then = dayjs(createdAt).format(dateTimeFormat); //convert date number to date string format
      const daysDiff = dayjs(nowDateTime, dateTimeFormat).diff(dayjs(then, dateTimeFormat), "days");
      if (daysDiff === 0) {
        const minutesDiff = dayjs(nowDateTime, dateTimeFormat).diff(
          dayjs(then, dateTimeFormat),
          "minutes",
        );
        if (minutesDiff < 59) {
          nTodayNotifications.push({ ...rest, createdAt: `${minutesDiff}minutes` });
        } else {
          const hoursDiff = dayjs(nowDateTime, dateTimeFormat).diff(
            dayjs(then, dateTimeFormat),
            "hours",
          );
          nTodayNotifications.push({ ...rest, createdAt: `${hoursDiff}h` });
        }
      } else if (daysDiff === 1) {
        const hoursDiff = dayjs(nowDateTime, dateTimeFormat).diff(
          dayjs(then, dateTimeFormat),
          "hours",
        );
        nYesterdayNotification.push({ ...rest, createdAt: `${hoursDiff}h` });
      } else {
        //TODO: 2-6 days, 1-3 week
        const daysDiff = dayjs(nowDateTime, dateTimeFormat).diff(
          dayjs(then, dateTimeFormat),
          "days",
        );
        if (daysDiff < 7) {
          nEarlierNotification.push({ ...rest, createdAt: `${daysDiff}d` });
        } else if (daysDiff < 30) {
          const weeksDiff = dayjs(nowDateTime, dateTimeFormat).diff(
            dayjs(then, dateTimeFormat),
            "weeks",
          );
          nEarlierNotification.push({ ...rest, createdAt: `${weeksDiff}w` });
        } else if (daysDiff < 365) {
          const monthsDiff = dayjs(nowDateTime, dateTimeFormat).diff(
            dayjs(then, dateTimeFormat),
            "months",
          );
          nEarlierNotification.push({ ...rest, createdAt: `${monthsDiff}m` });
        } else {
          const yearsDiff = dayjs(nowDateTime, dateTimeFormat).diff(
            dayjs(then, dateTimeFormat),
            "years",
          );
          nEarlierNotification.push({ ...rest, createdAt: `${yearsDiff}y` });
        }
      }
    });
    // return notificationData.filter((item) => item.isRead === false).length;

    setTodayNotification(nTodayNotifications);
    setYesterdayNotification(nYesterdayNotification);
    setEarlierNotification(nEarlierNotification);
    // return numOfUnread;
    // return 2;
  }, [data]);

  return (
    <Space direction="vertical">
      {!todayNotification?.length ? null : (
        <CategorizedNotificationContainer
          userId={userId}
          title={"Today"}
          notificationsData={todayNotification}
          onClickedHideNotification={onClickedHideNotification}
        />
      )}
      {!yesterdayNotification?.length ? null : (
        <>
          {todayNotification.length ? <Divider style={{ margin: 1 }} /> : null}
          <CategorizedNotificationContainer
            userId={userId}
            title={"Yesterday"}
            notificationsData={yesterdayNotification}
            onClickedHideNotification={onClickedHideNotification}
          />
        </>
      )}
      {!earlierNotification?.length ? null : (
        <>
          {todayNotification.length || yesterdayNotification.length ? (
            <Divider style={{ margin: 1 }} />
          ) : null}
          <CategorizedNotificationContainer
            userId={userId}
            title={"Ealier"}
            notificationsData={earlierNotification}
            onClickedHideNotification={onClickedHideNotification}
          />
        </>
      )}

      {/* <Button
        type="link"
        block
        // icon={<LogoutOutlined />}
        // onClick={}
      >
        View All
      </Button> */}
    </Space>
  );
};
export default NotificationContainers;
