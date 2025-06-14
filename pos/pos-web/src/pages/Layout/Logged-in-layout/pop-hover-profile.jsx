import { Button, Space, Row, Col, Divider, Popover, Typography, Avatar } from "antd";
import { LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import SwitchShop from "@/components/switch_shop/switchShop";

const { Text } = Typography;

const PopHoverProfile = ({ viewContentMbl }) => {
  const { userId, firstName, lastName, logout, shopRoles } = useFirebaseAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log(e);
    }
  };
  const content = (
    <Space direction="vertical">
      <span>User ID: {userId}</span>
      {/* <p>
          <Link to="/reset/password">Change Password</Link>
        </p> */}
      <Divider style={{ margin: 1 }} />
      <SwitchShop shopRoles={shopRoles} />
      <Divider style={{ margin: 1 }} />
      <Space direction="horizontal">
        <UserOutlined />
        <Link to="/profile/view" style={{ textDecoration: "none" }}>
          Profile
        </Link>
      </Space>
      <Space direction="horizontal">
        <SettingOutlined />
        <Link to="/settings" style={{ textDecoration: "none" }}>
          Settings
        </Link>
      </Space>
      <Button type="link" block icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Button>
    </Space>
  );

  return (
    <Popover
      placement="bottomRight"
      title={
        <span style={{ textTransform: "capitalize" }}>{`${firstName}${
          lastName ? ` ${lastName}` : ""
        }`}</span>
      }
      content={content}
      trigger="click"
    >
      <a>
        <Row className="welcome-sub-text" align="middle" gutter={12}>
          <Col>
            <Avatar shape="circle" icon={<UserOutlined />} size="default" />
          </Col>
          {!viewContentMbl ? (
            <Col>
              <Space direction="vertical" size={0}>
                <Text>{`${firstName}${lastName ? ` ${lastName}` : ""}`}</Text>
              </Space>
            </Col>
          ) : null}
        </Row>
      </a>
    </Popover>
  );
};
export default PopHoverProfile;
