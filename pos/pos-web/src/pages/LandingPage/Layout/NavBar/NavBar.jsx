import React, { Component, useState } from "react";
import LeftMenu from "../LeftMenu";
import RightMenu from "../RightMenu";
import { Drawer, Button, Menu, Space } from "antd";
import logo from "../../../../images/Property_icon.png";
import { Link } from "react-router-dom";
import "./style.css";

const NavBar = (props) => {
  const [visible, setvisible] = useState(false);
  const showDrawer = () => {
    setvisible(true);
  };

  const onClose = () => {
    setvisible(false);
  };
  return (
    <nav className="menuBar sticky" style={{ backgroundColor: "#c2dafe" }}>
      <div className="logoIndex">
        <Link to="/home">
          <img src={logo} width={"120px"} alt="logo" />
        </Link>
      </div>
      <div className="menuCon">
        <div className="leftMenu">
          <LeftMenu />
        </div>
        <div className="rightMenu">
          <RightMenu />
        </div>
        <span id="barsMenu" className="barsMenu" type="primary" onClick={showDrawer}>
          <span>
            <div className="hamBurger"></div>
            <div className="hamBurger"></div>
            <div className="hamBurger"></div>
          </span>
        </span>
        <Drawer placement="right" closable={false} open={visible}>
          <Space style={{ float: "right" }}>
            <Button onClick={onClose} style={{ border: "none" }}>
              <span style={{ paddingTop: "35px" }}>
                <div className="hamBurger"></div>
                <div className="hamBurger"></div>
                <div className="hamBurger"></div>
              </span>
            </Button>
          </Space>
          <Menu
            mode="inline"
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "#626262",
              padding: "10px",
              border: "none",
            }}
          >
            <Menu.Item key="home">
              <Link to="/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="about">
              <Link to="/about">About</Link>
            </Menu.Item>
            <Menu.Item key="subscription">
              <Link to="/subscription">Subscription</Link>
            </Menu.Item>
            <Menu.Item key="signin">
              <Link to="/login">Sign In</Link>
            </Menu.Item>
            <Menu.Item key="signUp">
              <Link to="/signup">
                {" "}
                <span>Sign Up</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Drawer>
      </div>
    </nav>
  );
};
export default NavBar;

// import { Button, Col, Drawer, Image, Layout, Menu, Row } from "antd";
// // import { Link } from "react-router-dom";
// // import logo from "path/to/logo";

// const { Header,Sider } = Layout;
// const NavBar = (props) => {
//   const [visible, setVisible] = useState(false);

//   const showDrawer = () => {
//     setVisible(true);
//   };

//   const onClose = () => {
//     setVisible(false);
//   };

//   return (
//     <Header>
//       <div className="logo">
//         <Link to="/home">
//           <img src={logo} width={'120px'} alt="logo" />
//         </Link>
//       </div>
//       <Menu theme="light" mode="horizontal">
//         <Menu.Item key="home">
//           <Link to="/home">Home</Link>
//         </Menu.Item>
//         <Menu.Item key="about">
//           <Link to="/about">About</Link>
//         </Menu.Item>
//         <Menu.Item key="pricing">
//           <Link to="/pricing">Pricing</Link>
//         </Menu.Item>
//       </Menu>
//       <div className="right-menu">
//         <Link to="/signin">Sign In</Link>
//         <Link to="/signup">Sign Up</Link>
//       </div>
//       <Button className="menu-button" onClick={showDrawer}>
//         <span className="bars"></span>
//       </Button>
//       <Drawer
//         title="Menu"
//         placement="right"
//         closable={false}
//         onClose={onClose}
//         visible={visible}
//       >

//         <Menu>
//           <Menu.Item key="home">
//             <Link to="/home">Home</Link>
//           </Menu.Item>
//           <Menu.Item key="about">
//             <Link to="/about">About</Link>
//           </Menu.Item>
//           <Menu.Item key="pricing">
//             <Link to="/pricing">Pricing</Link>
//           </Menu.Item>
//           <Menu.Item key="signin">
//             <Link to="/signin">Sign In</Link>
//           </Menu.Item>
//           <Menu.Item key="signup">
//             <Link to="/signup">Sign Up</Link>
//           </Menu.Item>
//         </Menu>
//       </Drawer>
//     </Header>
//   );
// };

// export default NavBar;
