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
import moment from "moment";
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
import { Link, useHistory } from "react-router-dom";
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
import { useCustomProperty } from "../../../../utils/hooks/customProperty";
import { COLLECTIONS } from "../../../../constants/collections";
import { useMemo } from "react";
import { ButtonToolbar } from "react-bootstrap";
import { ref } from "firebase/storage";
import { useCustomAuth } from "../../../../utils/hooks/customAuth";
// import notificationSvg from "path/to/message.svg"; // path to your '*.svg' file.
// import notificationSvg from "../../images/notification.svg";
// import InfiniteScroll from "react-infinite-scroll-component";
const { Text, Title } = Typography;
const { Option } = Select;
const dateTimeFormat = "YYYY/MM/DD, h:mm:ss a";
const dateFormat = "DD/MM/YYYY";
const milisecDiffForYesterday = 86400000;
// const { confirm } = Modal;
// const currentDateTime = moment().format(dateTimeFormat); // result return as string format

const NotificationContiner = ({ userId, title, notificationsData, onClickedHideNotification }) => {
  const history = useHistory();
  const firestore = useFirestore();

  const handleNotification = async (notification) => {
    //only unread notification will be updated
    if (!notification.isRead) {
      const notificationDocRef = doc(
        firestore,
        `${COLLECTIONS.users}/${userId}/${COLLECTIONS.notifications}/${notification.NO_ID_FIELD}`,
      );
      await updateDoc(notificationDocRef, {
        isRead: true,
        readAt: Date.now(),
      });
    }
    if (onClickedHideNotification) {
      onClickedHideNotification();
    }
    const url = getRedirectPath(notification);
    history.push(url);
  };
  // const handleRedirectURL = () => {
  //   notificationsData.varient;
  // };

  // FrontEND
  const acceptTenantRequest = async (managerId, tenantId, propertyId) => {
    // update firestore with appropriate logic
  };
  const rejectTenantRequest = async (managerId, tenantId, propertyId) => {
    // update firestore with appropriate logic
  };
  const getRedirectPath = (notification) => {
    switch (notification.variant) {
      case "signup":
        return "/";
      case "manage-access":
        return `/manage-access?tenantId=${notification.tenantId}`;
      case "announcement":
        return `/announcements?id=${notification.messageId}`;
      case "send-agreement":
        return `/properties/${notification.propertyId}/agreements/${notification.tenantAgreementId}`;
      case "send-invoice":
        return `/invoices/${notification.invoiceId}`;
      default:
        return "/";
    }
  };
  const getActions = (notification) => {
    switch (notification.variant) {
      case "signup":
        return [];
      case "manage-access":
        return [
          {
            label: "Accept",
            // callback: () =>
            //   acceptTenantRequest(
            //     notification.userId,
            //     notification.tenantId,
            //     notification.propertyId
            //   ),
          },
          {
            label: "Deny",
            // callback: () =>
            //   rejectTenantRequest(
            //     notification.userId,
            //     notification.tenantId,
            //     notification.propertyId
            //   ),
          },
        ];
      case "send-agreement":
        return [];
      case "send-invoice":
        return [];
      default:
        return [];

      // ...
      // ...
      // ...
      // ...
    }
  };

  return (
    <>
      <Text>{title}</Text>
      {notificationsData.map((notification, index) => {
        return (
          // <a
          //   key={index}

          //   // style={notification.isRead ? { pointerEvents: "none" } : null}
          // >
          <Row
            key={index}
            gutter={[24, 24]}
            // style={notification.isRead ? { background: "#f1f1f1" } : { background: "#fbfbfb" }}
          >
            {/* <Col>
          {propertyData.propertyImage ? (
            <FetchFile storagePath={propertyData.propertyImage} />
          ) : null}
        </Col> */}
            <Col offset={1}>
              {/* <Col xs={8} sm={8} md={8} lg={8} xl={8}> */}
              <Space direction="vertical" size={1}>
                <a>
                  <Text
                    type={notification.isRead ? "secondary" : null}
                    onClick={async () => await handleNotification(notification)}
                  >
                    {notification.variant}
                  </Text>
                </a>
                <a>
                  <Title
                    level={5}
                    type={notification.isRead ? "secondary" : null}
                    onClick={async () => await handleNotification(notification)}
                  >
                    {notification.message}
                  </Title>
                </a>
                {!notification.isRead ? (
                  <Space direction="horizontal">
                    {getActions(notification).map((action, i) => (
                      <Button key={i} type={!i ? "primary" : "default"} onClick={action.callback}>
                        {action.label}
                      </Button>
                    ))}
                  </Space>
                ) : null}

                <Text type={notification.isRead ? "secondary" : null}>
                  {notification.createdAt}
                </Text>
              </Space>
            </Col>
          </Row>
          // </a>
        );
      })}
    </>
  );
};
export default NotificationContiner;
