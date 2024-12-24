import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const LeftMenu = () => {
  return (
    <Menu mode="horizontal" style={{ fontSize: "13px", fontWeight: "bold", color: "#626262" }}>
      <Menu.Item key="home">
        <Link to="/home">Home</Link>
      </Menu.Item>
      <Menu.Item key="about">
        <Link to="/about">About</Link>
      </Menu.Item>
      <Menu.Item key="subscription">
        <Link to="/subscription">Subscription</Link>
      </Menu.Item>
    </Menu>
  );
};
export default LeftMenu;
