import React, { useState } from "react";
import { Layout, Menu, Button, Grid, Popover, Dropdown, Avatar, List, Space } from "antd";
import {
  BellOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  PropertySafetyOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Link, Route, Routes } from "react-router-dom";
import ManagerApp from "../../ManagerView/ManagerApp/ManagerApp";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import CustomSidebar from "./custom-sider";
// import PopHoverNotifications from "@/components/Notification/PopHoverNotification/PopHoverNotifications";
import PopHoverProfile from "./pop-hover-profile";
import { USER_ROLE } from "@pos/shared-models";
// import Notificationlist from "@/components/Notification/NotificationList";
// import OwnerApp from "../../SalesmanView/OwnerApp/OwnerApp";
// import TenantApp from "../../TenantView/TenantApp/TenantApp";
import UserApp from "../UserView/UserApp";

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

const LoggedInLayout = () => {
  const { userId, role, firstName, lastName } = useCustomAuth();
  // const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();

  const notifications = [
    { id: 1, title: "New Comment", content: "Someone commented on your post." },
    {
      id: 2,
      title: "Order Shipped",
      content: "Your order #12345 has been shipped.",
    },
    { id: 3, title: "New Follower", content: "You have a new follower!" },
    {
      id: 4,
      title: "Message Received",
      content: "You received a new message.",
    },
    {
      id: 5,
      title: "Password Changed",
      content: "Your password was successfully changed.",
    },
  ];

  const userMenu = [
    {
      key: "1",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: "Settings",
    },
    {
      key: "3",
      label: "Logout",
    },
  ];

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  const notificationContent = (
    <List
      dataSource={notifications}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <List.Item.Meta title={item.title} description={item.content} />
        </List.Item>
      )}
      style={{ width: 300 }}
    />
  );

  return (
    <Layout style={{ minHeight: "10vh" }}>
      <CustomSidebar
        isScreenMd={screens.md}
        toggleDrawer={toggleDrawer}
        drawerVisible={drawerVisible}
      />
      <Layout style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            // background: "#001529",
            // color: "#fff",

            display: "flex",
            alignItems: "center", //(vertically center): Center the alignments for all the items of the flexible
            justifyContent: "space-between", //horizontally space between items
            padding: "0 12px",
            //new
            // background: "#c2dafe",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* {screens.md && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="https://via.placeholder.com/40"
                  alt="Logo"
                  style={{ height: "40px", marginRight: "8px" }}
                />
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#fff" }}>
                  Your App Name
                </span>
              </div>
            )} */}

            {!screens.md && (
              <Button
                type="text"
                icon={<MenuFoldOutlined />}
                onClick={toggleDrawer}
                // style={{ color: "#fff" }}
              />
            )}
            {/* <span
              style={{
                fontSize: "18px",
                // color: "#fff"
              }}
            >
              Welcome, User!
            </span> */}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Popover
              content={notificationContent}
              title="Notifications"
              trigger="click"
              placement="bottomRight"
            >
              <Button
                type="text"
                icon={<BellOutlined />}
                // style={{ color: "#fff" }}
              />
            </Popover>
            {/* <PopHoverNotifications /> */}
            <PopHoverProfile viewContentMbl={screens.md} />
            {/* <Dropdown menu={{ items: userMenu }} trigger={["click"]}>
              <Avatar
                icon={<UserOutlined />}
                style={{ cursor: "pointer", backgroundColor: "#1890ff" }}
              />
            </Dropdown> */}

            {screens.md ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  marginRight: "8px",
                  // color: "#fff",
                  textAlign: "left",
                  lineHeight: "1",
                }}
              >
                {/* Username */}
                <span style={{ fontWeight: "bold" }}>{`${firstName}${
                  lastName ? ` ${lastName}` : ""
                }`}</span>
                {/* User role */}
                <span style={{ fontSize: "12px", marginTop: "0" }}>{USER_ROLE.KEYS[role]}</span>
              </div>
            ) : null}
          </div>
        </Header>

        <Content style={{ margin: "10px", padding: "2px", background: "#fff" }}>
          <div
          // className="site-layout-background" style={{ paddingBottom: "70px" }}
          >
            {/* {role === "manager" || role === "owner" || role === "tenant" ? (
              <Routes>
                <Route path="/notifications" exact>
                  <Notificationlist />
                </Route>
              </Routes>
            ) : null} */}
            <UserApp />
            {role === USER_ROLE.VALUES.Admin ? <ManagerApp /> : null}
            {/* {role === USER_ROLE.VALUES.Manager ? <OwnerApp /> : null}
            {role === USER_ROLE.VALUES.Salesman ? <TenantApp /> : null} */}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            // background: "#001529",
            // color: "#fff",
            color: "black",
            position: "sticky",
            bottom: 0,
            lineHeight: 1,
            gap: 1,
          }}
        >
          {/* ©{new Date().getFullYear()} Created by CDPRC */}
          ©2024 Created by Organic Design
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LoggedInLayout;
