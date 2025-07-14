import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  CloseOutlined,
  DashboardOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  ProductOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Drawer } from "antd";
import { useMemo, useState } from "react";
import { AppVersion } from "@/pages/AppVersion";
import logo from "../../../images/logo.png";
import bkash_logo from "../../../images/bkash-logo-transparent.png";
import { SHOP_ROLE, USER_ROLE } from "@/constants/role";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
const { Sider } = Layout;

const CustomSidebar = ({ isScreenMd, toggleDrawer, drawerVisible }) => {
  const { session } = useFirebaseAuth();
  const [collapsed, setCollapsed] = useState(false);
  // const { shopId, shopRole } = useCustomShop();

  const leftSiderItems = useMemo(() => {
    const nLeftSiderItems = [
      {
        key: "1",
        label: (
          <span>
            <Link to="/dashboard">Dashboard</Link>
          </span>
        ),
        icon: <DashboardOutlined />,
      },
    ];
    if (session.role === USER_ROLE.VALUES.Admin) {
      nLeftSiderItems.push({
        key: "2",
        label: (
          <span>
            <Link to="/users">Users</Link>
          </span>
        ),
        icon: <UserOutlined />,
      });
    }
    if (session.shopId) {
      if ([SHOP_ROLE.VALUES.Manager, SHOP_ROLE.VALUES.Salesman].includes(session.shopRole)) {
        nLeftSiderItems.push({
          key: "3",
          label: (
            <span>
              <Link to="/sales">Sales</Link>
            </span>
          ),
          icon: <ShoppingCartOutlined />,
        });
      }
      if (session.shopRole === SHOP_ROLE.VALUES.Manager) {
        nLeftSiderItems.push({
          key: "4",
          label: "Product",
          icon: <AppstoreOutlined />,
          children: [
            {
              key: "4.1",
              label: <Link to="/products/add">Add Product</Link>,
              icon: <ProductOutlined />,
            },
            {
              key: "4.2",
              label: <Link to="/products">Products</Link>,
              icon: <AppstoreOutlined />,
            },
          ],
        });
      }
      if ([SHOP_ROLE.VALUES.Manager, SHOP_ROLE.VALUES.Salesman].includes(session.shopRole)) {
        nLeftSiderItems.push({
          key: "5",
          label: "Invoices",
          icon: <FileTextOutlined />,
          children: [
            {
              key: "5.1",
              label: <Link to="/invoices">History</Link>,
              icon: <ProductOutlined />,
            },
            {
              key: "5.2",
              label: <Link to="/reports">Report</Link>,
              icon: <AppstoreOutlined />,
            },
          ],
        });
      }
    }
    nLeftSiderItems.push(
      {
        key: "6",
        label: <Link to="/btransactions">Transactions</Link>,
        icon: <img src={bkash_logo} alt="bKash" style={{ height: 24 }} />,
      },
      {
        key: "7",
        label: <Link to="/gl-report">GL Report</Link>,
        icon: <FileSearchOutlined />,
      },
      {
        key: "8",
        label: <Link to="/barcode">"Test Barcode"</Link>,
        icon: <FileTextOutlined />,
      },
      {
        key: "9",
        label: <Link to="/print-barcode">Print Barcode</Link>,
        icon: <FileTextOutlined />,
      },
    );
    return nLeftSiderItems;
  }, [session]);

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
