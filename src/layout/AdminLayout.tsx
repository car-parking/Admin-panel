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
  // ✅ Hook-larni return dan oldin chaqiramiz
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  // Sidebar ochish/yopish uchun tugma handleri
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
      {/* ✅ Sidebar Dark mode bilan moslashgan */}
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
        {/* ✅ Header Styling */}
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

          {/* ✅ Dark Mode Switch */}
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
          />
        </Header>

        {/* ✅ Content Styling */}
        <Content
          style={{
            margin: "16px",
            padding: "16px",
            background: darkMode ? "#141414" : "#fff",
            color: darkMode ? "white" : "black",
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
