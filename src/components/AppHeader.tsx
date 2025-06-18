import React from "react";
import { Layout, Menu, Button, Avatar, Dropdown } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/settings">Settings</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        position: "fixed",
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        background: "#001529",
      }}
    >
      {/* Brand Name */}
      <div style={{ flex: "0 0 auto" }}>
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

      {/* Navigation Menu */}
      <div style={{ flex: "1 1 auto", marginLeft: 40 }}>
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
              : location.pathname === "/our-story"
              ? "5"
              : "",
          ]}
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
            <Link to="/our-story">Our Story</Link>
          </Menu.Item>
        </Menu>
      </div>

      {/* Sign In / Avatar */}
      <div style={{ flex: "0 0 auto", marginLeft: 16 }}>
        {isAuthenticated ? (
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div style={{ cursor: "pointer" }}>
              <Avatar
                src={user?.image}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1890ff" }}
              />
            </div>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;
