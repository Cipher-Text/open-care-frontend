import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Drawer } from "antd";
import {
  MenuOutlined,
  HomeOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  BankOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import "../App.css";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const menuItems = [
    { key: "/", icon: <HomeOutlined />, label: "Home" },
    { key: "/doctors", icon: <MedicineBoxOutlined />, label: "Doctors" },
    { key: "/hospitals", icon: <BankOutlined />, label: "Hospitals" },
    { key: "/institutes", icon: <ReadOutlined />, label: "Institutes" },
    { key: "/profile", icon: <UserOutlined />, label: "Profile" },
  ];

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
      <div className="logo" />

      {/* Mobile menu button */}
      <div className="mobile-menu">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={showDrawer}
          style={{ color: "white" }}
        />
        <Drawer
          title="Menu"
          placement="right"
          closable={true}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ padding: 0 }}
        >
          <Menu
            theme="light"
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={menuItems.map((item) => ({
              ...item,
              label: <Link to={item.key}>{item.label}</Link>,
            }))}
          />
        </Drawer>
      </div>

      {/* Desktop menu */}
      <div className="desktop-menu">
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ flex: 1, minWidth: 0 }}
          items={menuItems.map((item) => ({
            ...item,
            label: <Link to={item.key}>{item.label}</Link>,
          }))}
        />
      </div>
    </Header>
  );
};

export default AppHeader;
