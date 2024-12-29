import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  CloseOutlined,
  DashboardOutlined,
  FileTextOutlined,
  ProductOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Drawer } from "antd";
import { useState } from "react";
import { AppVersion } from "@/pages/AppVersion";
import logo from "../../../images/logo.png";
const { Sider } = Layout;

const CustomSidebar = ({ isScreenMd, toggleDrawer, drawerVisible }) => {
  const [collapsed, setCollapsed] = useState(false);

  const leftSiderItems = [
    {
      key: "1",
      label: (
        <span>
          <Link to="/">Dashboard</Link>
        </span>
      ),
      icon: <DashboardOutlined />,
    },
    {
      key: "4",
      label: (
        <span>
          <Link to="/sales">Sales</Link>
        </span>
      ),
      icon: <ShoppingCartOutlined />,
    },
    {
      key: "2",
      label: "Product",
      icon: <AppstoreOutlined />,
      children: [
        {
          key: "21",
          label: <Link to="/products/add">Add Product</Link>,
          icon: <ProductOutlined />,
        },
        {
          key: "22",
          label: <Link to="/products">Products</Link>,
          icon: <AppstoreOutlined />,
        },
      ],
    },
    {
      key: "3",
      label: "Invoices",
      icon: <FileTextOutlined />,
      children: [
        {
          key: "3.1",
          label: <Link to="/invoices">History</Link>,
          icon: <ProductOutlined />,
        },
        {
          key: "3.2",
          label: <Link to="/reports">Report</Link>,
          icon: <AppstoreOutlined />,
        },
      ],
    },
  ];

  return !isScreenMd ? (
    <Drawer
      placement="left"
      onClose={toggleDrawer}
      closeIcon={false}
      open={drawerVisible}
      styles={{
        // header: {
        //   display: 'none',
        //   bodyStyle: { padding: 0 },
        //   footerStyle: { opacity: 0 },
        // },
        body: { padding: 0 },
      }}
      title={
        <img
          style={{
            // width: "40%",
            // height: "4%",
            transition: "opacity 0.3s ease",
            opacity: collapsed ? 0 : 1,
          }}
          src={logo}
          // width={"55%"}
          alt="logo"
        />
      }
      extra={
        <CloseOutlined onClick={toggleDrawer} style={{ fontSize: "16px", cursor: "pointer" }} />
      }
    >
      <div
        style={{
          textAlign: "center",
          padding: "16px 0",
          // background: "#001529",
        }}
      >
        {/* <img
          src="https://via.placeholder.com/80"
          alt="Logo"
          style={{
            height: "40px",
            transition: "opacity 0.3s ease",
            opacity: collapsed ? 0 : 1,
          }}
        /> */}
        <AppVersion />
      </div>

      <Menu
        mode="inline"
        // theme="dark"
        style={{ height: "100" }}
        items={leftSiderItems}
        onClick={() => toggleDrawer()}
      />
    </Drawer>
  ) : (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        flexShrink: 0,
        backgroundColor: "#EBFFEB", //sky blue
      }}
      theme="light" //by default it's "dark"
    >
      <div
        style={{
          textAlign: "center",
          padding: "16px 0",
          backgroundColor: "white", //override slider's backgroun color
        }}
      >
        {/* <img
          src="https://via.placeholder.com/80"
          alt="Logo"
          style={{
            height: "40px",
            transition: "opacity 0.3s ease",
            opacity: collapsed ? 0 : 1,
          }}
        /> */}
        <img src={logo} alt="logo" />
        {/* <p>Organic Design</p> */}
        <AppVersion />
      </div>

      <Menu
        // theme="dark"
        mode="inline"
        //new
        style={{
          backgroundColor: "#EBFFEB", //sky blue
        }}
        items={leftSiderItems}
      />
    </Sider>
  );
};
export default CustomSidebar;
