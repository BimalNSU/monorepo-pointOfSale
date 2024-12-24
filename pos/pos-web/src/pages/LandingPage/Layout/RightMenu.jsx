import React from "react";
import { Menu, Button } from "antd";
import { Link } from "react-router-dom";
import './style.css';

const RightMenu = () => {
  return (
    <Menu mode="horizontal" style={{ fontSize: "13px", fontWeight: "bold", color: "#626262" }}>
      <Menu.Item key="signin">
        <Link to="/login">Sign In</Link>
      </Menu.Item>
      <Menu.Item key="signUp">
        <Link to="/signup">
          {" "}
          <Button
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "#222222",
              border:"none"
            }}
          >
            Sign Up
          </Button>
        </Link>
      </Menu.Item>
    </Menu>
  );
};
export default RightMenu;
