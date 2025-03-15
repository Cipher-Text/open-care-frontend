import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const location = useLocation();

  return (
    <Header
      style={{
        position: "fixed",
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div className="brand-name">
        <Link to="/">
          <h1
            style={{
              color: "white",
              margin: 0,
              fontSize: 24,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "0.5px",
              background: "linear-gradient(90deg, #1890ff, #40a9ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Open Care
          </h1>
        </Link>
      </div>

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[
          location.pathname === "/"
            ? "1"
            : location.pathname === "/doctors"
            ? "2"
            : location.pathname === "/hospitals"
            ? "3"
            : location.pathname === "/institutes"
            ? "4"
            : location.pathname === "/profile"
            ? "5"
            : "",
        ]}
        style={{ lineHeight: "64px" }}
      >
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/doctors">Doctors</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/hospitals">Hospitals</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/institutes">Institutes</Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="/profile">Profile</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default AppHeader;
