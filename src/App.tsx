import React, { useState } from "react";
import { Button, Layout, Menu, Typography } from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import "./App.css";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <Layout className="layout">
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={[
            { key: "1", icon: <HomeOutlined />, label: "Home" },
            { key: "2", icon: <UserOutlined />, label: "Profile" },
            { key: "3", icon: <SettingOutlined />, label: "Settings" },
          ]}
        />
      </Header>
      <Content style={{ padding: "0 50px", marginTop: 40 }}>
        <div
          className="site-layout-content"
          style={{ padding: 24, minHeight: 280 }}
        >
          <Title level={2}>Hello Ant Design!</Title>
          <p>Welcome to your new React app with TypeScript and Ant Design</p>

          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={() => setCount(count + 1)}>
              Count: {count}
            </Button>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2023 Created with Vite and React
      </Footer>
    </Layout>
  );
}

export default App;
