import React, { useState } from "react";
import { Layout, Menu, Button, Switch } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ darkMode, setDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "users", icon: <UserOutlined />, label: "Foydalanuvchilar" },
    { key: "owners", icon: <UserOutlined />, label: "Owner" },
    { key: "admins", icon: <UserAddOutlined />, label: "Adminlar" },
    { key: "settings", icon: <SettingOutlined />, label: "Sozlamalar" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Chiqish",
      onClick: () => {
        logout();
        navigate("/login");
      },
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme={darkMode ? "dark" : "light"}>
        <div
          style={{
            height: 64,
            margin: 16,
            color: darkMode ? "white" : "black",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          <b>{!collapsed ? "Admin Panel" : "AP"}</b>
        </div>
        <Menu
          theme={darkMode ? "dark" : "light"}
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
          onClick={({ key }) => key !== "logout" && navigate(`/${key}`)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: darkMode ? "#001529" : "#fff",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={toggleCollapsed}
              style={{ fontSize: "18px", marginRight: "16px", color: darkMode ? "white" : "black" }}
            />
            <span style={{ fontSize: "18px", fontWeight: "bold", color: darkMode ? "white" : "black" }}>
              Admin Panel
            </span>
          </div>

          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
          />
        </Header>

        <Content
  style={{
    margin: "16px",
    padding: "16px",
    background: darkMode ? "#0A1F44" : "#F0F5FF", 
    color: darkMode ? "#D6E4FF" : "#002766", 
    minHeight: "calc(100vh - 64px)",
  }}
>
  <Outlet />
</Content>

      </Layout>
    </Layout>
  );
};

export default AdminLayout;
