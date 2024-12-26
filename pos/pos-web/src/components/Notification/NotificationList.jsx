// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Menu,
//   Button,
//   Input,
//   message,
//   Space,
//   Row,
//   Col,
//   Select,
//   Table,
//   Dropdown,
//   Modal,
//   Tag,
//   Spin,
//   Typography,
//   List,
//   Image,
//   Badge,
//   Avatar,
//   Popover,
//   Divider,
//   Card,
// } from "antd";
// import dayjs from "dayjs";
// import Icon, { DownOutlined, SearchOutlined, FilePdfOutlined } from "@ant-design/icons";

// import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
// import {
//   doc,
//   getFirestore,
//   updateDoc,
//   getDocs,
//   addDoc,
//   deleteDoc,
//   query,
//   where,
//   collection,
//   documentId,
//   orderBy,
// } from "firebase/firestore";
// import { Link } from "react-router-dom";
// import {
//   FirebaseAppProvider,
//   FirestoreProvider,
//   useFirestoreDocData,
//   useFirestore,
//   useFirestoreCollectionData,
//   useFirebaseApp,
//   useAuth,
//   useStorage,
//   useStorageDownloadURL,
// } from "reactfire";
// // import { error } from "../../../../utils/Utils/Utils";
// import { useCustomProperty } from "../../utils/hooks/customProperty";
// import { COLLECTIONS } from "../../constants/collections";
// import { useMemo } from "react";
// import { ButtonToolbar } from "react-bootstrap";
// import { ref } from "firebase/storage";
// import { useCustomAuth } from "../../utils/hooks/customAuth";
// // import notificationSvg from "path/to/message.svg"; // path to your '*.svg' file.
// // import notificationSvg from "../../images/notification.svg";
// import NotificationContainers from "./SubComponents/NotificationContainers";
// // import InfiniteScroll from "react-infinite-scroll-component";
// const { Text, Title } = Typography;
// const { Option } = Select;
// const dateTimeFormat = "DD/MM/YYYY, HH:mm:ss";
// const dateFormat = "DD/MM/YYYY";
// // const milisecDiffForYesterday = 86400000;
// // const { confirm } = Modal;
// // const currentDateTime = dayjs().format(dateTimeFormat); // result return as string format

// const Notificationlist = () => {
//   const { propertyId } = useCustomProperty();
//   const pFilters = ["all"];
//   if (propertyId) {
//     pFilters.push(propertyId);
//   }
//   const { userId, role } = useCustomAuth();
//   const firestore = useFirestore();
//   const storage = useStorage();
//   // const [todayNotification, setTodayNotification] = useState();
//   // const [yesterdayNotification, setYesterdayNotification] = useState();
//   // const [earlierNotification, setEarlierNotification] = useState();

//   const notificationsCollectionRef = collection(
//     firestore,
//     COLLECTIONS.users,
//     userId,
//     COLLECTIONS.notifications,
//   );
//   const q = query(
//     notificationsCollectionRef,
//     // where("propertyId", "==", propertyId), //TODO: this line causes newly registered user welcome message not working
//     // where("propertyId", "in", pFilters),
//     where("role", "==", role),
//     where("isDeleted", "==", false),
//     orderBy("createdAt", "desc"),
//   );
//   const { status, data: notificationData } = useFirestoreCollectionData(q);
//   //TODO: need to test when propertyId is changed does the query working or not. If not then following "filteredNotifications" will be used
//   const filteredNotifications = useMemo(() => {
//     return (
//       notificationData?.filter(
//         (notification) =>
//           notification.variant === "send-agreement" ||
//           ((role === "owner" || role === "tenant") && notification.variant === "send-invoice") ||
//           pFilters.includes(notification.propertyId),
//       ) || []
//     );
//   }, [notificationData, propertyId]);
//   const FetchFile = ({ storagePath }) => {
//     const { data: fileUrl } = useStorageDownloadURL(ref(storage, storagePath));
//     if (storagePath.split(".")[1] === "pdf") {
//       return (
//         <a
//           href={fileUrl}
//           target="_blank"
//           style={{
//             width: "90px",
//             height: "120px",
//             paddingBottom: "20px",
//             paddingRight: "10px",
//             marginLeft: "10px",
//           }}
//           rel="noreferrer"
//         >
//           LINK
//         </a>
//       );
//     } else {
//       return (
//         <Image
//           src={fileUrl}
//           width={50}
//           preview={false}
//           // alt="Image"
//           // style={{
//           //   width: "50px",
//           //   height: "50px",
//           //   paddingBottom: "20px",
//           //   paddingRight: "10px",
//           //   marginLeft: "10px",
//           // }}
//         />
//       );
//     }
//   };
//   const text = (
//     <Title style={{ backgroundColor: "#EBFFEB" }} level={5}>
//       Notification
//     </Title>
//   );

//   if (status === "loading") {
//     return (
//       <>Loading...</>
//       //   <div className={`spin`}>
//       //     <Spin size="default" />
//       //   </div>
//     );
//   }

//   return (
//     <div className="addPadding-40">
//       <Card title="Notifications" headStyle={{ backgroundColor: "#71BD44", color: "white" }}>
//         {/* <NotificationContainers data={notificationData} /> */}
//         <NotificationContainers data={filteredNotifications} />
//       </Card>
//     </div>
//   );
// };
// export default Notificationlist;
