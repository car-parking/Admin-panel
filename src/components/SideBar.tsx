import { Layout, Menu } from "antd";
import { DashboardOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  return (
    <Sider collapsible>
      <div
        style={{
          height: "32px",
          margin: "16px",
          color: "white",
          textAlign: "center",
          fontSize: "18px",
        }}
      >
        Admin Panel
      </div>
      <Menu theme="dark" mode="inline">
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/users">Users</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<SettingOutlined />}>
          <Link to="/settings">Settings</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
