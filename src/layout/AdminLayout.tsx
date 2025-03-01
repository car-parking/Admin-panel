import React, { useState } from "react";
import { Layout, Menu, Button, Switch } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserAddOutlined,
  CarOutlined,
  WalletOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ darkMode, setDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const currentPath = location.pathname.split('/')[1] || 'dashboard';

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "users", icon: <UserOutlined />, label: "Foydalanuvchilar" },
    { key: "admins", icon: <UserAddOutlined />, label: "Adminlar" },
    { 
      key: "parking-spots",
      icon: <CarOutlined />, 
      label: "Parking Joylar" 
    },
    { 
      key: "payments",
      icon: <WalletOutlined />, 
      label: "To'lovlar" 
    },
    { 
      key: "reservations",
      icon: <ScheduleOutlined />, 
      label: "Rezervatsiyalar" 
    },
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
    <Layout style={{ maxHeight: "100vh", minHeight: "100vh"}}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme={darkMode ? "dark" : "light"} style={{
            background: darkMode ? "rgba(0, 21, 41, 1)" : "rgba(173, 216, 230, 0.9)",

      }}>
        <div
          style={{
            height: 64,
            margin: 16,
            color: darkMode ? "rgba(214, 228, 255, 1)" : "rgba(0, 39, 102, 1)",

            fontSize: 18,
            textAlign: "center",
            background: darkMode ? "rgba(0, 21, 41, 1)" : "rgba(173, 216, 230, 0.9)",
          }}
        >
          <b>{!collapsed ? "Admin Panel" : "AP"}</b>
        </div>
        <Menu
          theme={darkMode ? "dark" : "light"}
          mode="inline"
          selectedKeys={[currentPath]}
          items={menuItems}
          onClick={({ key }) => key !== "logout" && navigate(`/${key}`)}
          style={{ background: darkMode ? "rgba(0, 21, 41, 1)" : "rgba(173, 216, 230, 0.9)" }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: darkMode ? "rgba(0, 21, 41, 1)" : "rgba(173, 216, 230, 0.9)",
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
              style={{ fontSize: "18px", marginRight: "16px", color: darkMode ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)" }}
            />
<h1>LOGO</h1>
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
            background: darkMode ? "rgba(10, 31, 68, 1)" : "rgba(173, 216, 230, 0.9)",
            color: darkMode ? "rgba(214, 228, 255, 1)" : "rgba(0, 39, 102, 1)",
            minHeight: "calc(100vh - 64px)",
            maxHeight: "100%",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
