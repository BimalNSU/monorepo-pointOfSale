import { Button, Space, Row, Col, Select, Typography } from "antd";

import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "reactfire";
// import { error } from "../../../../utils/Utils/Utils";
import { COLLECTIONS } from "../../../../constants/collections";
const { Text, Title } = Typography;
const { Option } = Select;

const NotificationContiner = ({ userId, title, notificationsData, onClickedHideNotification }) => {
  const navigate = useNavigate();
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
    navigate(url);
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
              <Space orientation="vertical" size={1}>
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
                  <Space orientation="horizontal">
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
