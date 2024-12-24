import { useState } from "react";
import { Space, Row, Col, Typography, Image, Badge, Avatar, Popover } from "antd";
import { NotificationOutlined } from "@ant-design/icons";

import { query, where, collection, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  useFirestore,
  useFirestoreCollectionData,
  useStorage,
  useStorageDownloadURL,
} from "reactfire";
import { useCustomProperty } from "../../../utils/hooks/customProperty";
import { COLLECTIONS } from "../../../constants/collections";
import { useMemo } from "react";
import { ref } from "firebase/storage";
import { useCustomAuth } from "../../../utils/hooks/customAuth";
import NotificationContainers from "../SubComponents/NotificationContainers";
const { Title } = Typography;

const PopHoverNotifications = () => {
  const { propertyId } = useCustomProperty();
  const pFilters = ["all"];
  if (propertyId) {
    pFilters.push(propertyId);
  }
  const { userId, role } = useCustomAuth();
  const firestore = useFirestore();
  const storage = useStorage();
  const [open, setOpen] = useState(false);

  // const [todayNotification, setTodayNotification] = useState();
  // const [yesterdayNotification, setYesterdayNotification] = useState();
  // const [earlierNotification, setEarlierNotification] = useState();

  const notificationsCollectionRef = collection(
    firestore,
    COLLECTIONS.users,
    userId,
    COLLECTIONS.notifications,
  );
  const q = query(
    notificationsCollectionRef,
    // where("propertyId", "==", propertyId),
    // where("propertyId", "in", pFilters),
    where("role", "==", role),
    where("isDeleted", "==", false),
    orderBy("createdAt", "desc"),
  );
  const { status, data: notificationData } = useFirestoreCollectionData(q);

  //TODO: need to test when propertyId is changed does the query working or not. If not then following "filteredNotifications" will be used
  const filteredNotifications = useMemo(() => {
    return (
      notificationData?.filter(
        (notification) =>
          notification.variant === "send-agreement" ||
          ((role === "owner" || role === "tenant") && notification.variant === "send-invoice") ||
          pFilters.includes(notification.propertyId),
      ) || []
    );
  }, [notificationData, propertyId]);
  const FetchFile = ({ storagePath }) => {
    const { data: fileUrl } = useStorageDownloadURL(ref(storage, storagePath));
    if (storagePath.split(".")[1] === "pdf") {
      return (
        <a
          href={fileUrl}
          target="_blank"
          style={{
            width: "90px",
            height: "120px",
            paddingBottom: "20px",
            paddingRight: "10px",
            marginLeft: "10px",
          }}
          rel="noreferrer"
        >
          LINK
        </a>
      );
    } else {
      return (
        <Image
          src={fileUrl}
          width={50}
          preview={false}
          // alt="Image"
          // style={{
          //   width: "50px",
          //   height: "50px",
          //   paddingBottom: "20px",
          //   paddingRight: "10px",
          //   marginLeft: "10px",
          // }}
        />
      );
    }
  };
  const text = (
    <Title style={{ backgroundColor: "#EBFFEB" }} level={5}>
      Notification
    </Title>
  );

  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const content = (
    <Space direction="vertical">
      <NotificationContainers
        // data={notificationData}
        data={filteredNotifications}
        numOfMaxNotification={5}
        onClickedHideNotification={hide}
      />
      {/* <Button
        type="link"
        block
        // icon={<LogoutOutlined />}
        // onClick={}
      >
        View All
      </Button>
       */}
      <Row justify="center" onClick={hide}>
        <Link
          to="/notifications"
          style={{
            color: "black",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          View All Notifications
        </Link>
      </Row>
    </Space>
  );

  const numberOfUnreadNotifications = useMemo(() => {
    if (status === "success") {
      // return notificationData.filter((item) => item.isRead === false).length;
      return filteredNotifications.filter((item) => item.isRead === false).length;
    }
    return 0;
    // }, [notificationData]);
  }, [filteredNotifications]);
  if (status === "loading") {
    return (
      <>Loading...</>
      //   <div className={`spin`}>
      //     <Spin size="default" />
      //   </div>
    );
  }

  return (
    <>
      <Popover
        placement="bottomRight"
        content={content}
        title={text}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Row align="middle" className="welcome-sub-text">
          <Col>
            <a>
              <Badge count={numberOfUnreadNotifications}>
                {/* <Icon component={notificationSvg} /> */}
                <Avatar shape="circle" icon={<NotificationOutlined />} size="default" />
              </Badge>
            </a>
          </Col>
        </Row>
      </Popover>
    </>
  );
};
export default PopHoverNotifications;
