import React from "react";
import { Layout, Menu, Button, message } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  FolderOutlined,
  UploadOutlined,
  SettingOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "../styles/AdminDashboard.css";

const { Header, Sider, Content } = Layout;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage and redirect to login
    localStorage.clear();
    message.success("You have been logged out successfully.");
    navigate("/login");
  };

  return (
    <Layout className="admin-dashboard-layout">
      {/* Sidebar */}
      <Sider
        className="admin-dashboard-sider"
        breakpoint="lg"
        collapsedWidth="80"
      >
        <div className="admin-logo">Admin Panel</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/admindashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/admindashboard/manageusers">Manage Users</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<FolderOutlined />}>
            <Link to="/admindashboard/managefolders">Manage Folders</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<UploadOutlined />}>
            <Link to="/admindashboard/uploads">Uploads</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<BarChartOutlined />}>
            <Link to="/admindashboard/reports">Reports</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<SettingOutlined />}>
            <Link to="/admindashboard/settings">Settings</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className="admin-dashboard-header">
          <div className="header-content">
            <span className="header-title">Admin Panel</span>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </Button>
          </div>
        </Header>

        {/* Content */}
        <Content className="admin-dashboard-content">
          {/* Dynamically render content based on the route */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
