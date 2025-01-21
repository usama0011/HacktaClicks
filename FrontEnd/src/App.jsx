import React from "react";
import {
  Layout,
  Menu,
  Card,
  Col,
  Row,
  Calendar,
  Typography,
  Button,
} from "antd";
import {
  FolderOutlined,
  CheckSquareOutlined,
  FolderAddOutlined,
  UploadOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const navigate = useNavigate();

  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all data from localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <Layout className="app-layout">
      {/* Navbar */}
      <Header
        className="app-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          className="app-logo"
          style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}
        >
          Hackta Connect
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          style={{
            backgroundColor: "transparent",
            flexGrow: 1,
            display: "flex",
            justifyContent: "flex-end",
          }}
          defaultSelectedKeys={["1"]}
          className="app-menu"
        >
          <Menu.Item
            key="2"
            icon={<FolderOutlined style={{ color: "white" }} />}
          >
            <Link to="/viewfolders" style={{ color: "white" }}>
              My Folders
            </Link>
          </Menu.Item>

          <Menu.Item
            style={{ color: "white" }}
            key="4"
            icon={<UserSwitchOutlined />}
          >
            <Link to="/signup" style={{ color: "white" }}>
              Sign up
            </Link>
          </Menu.Item>
          <Menu.Item key="5" className="logout-menu-item">
            <Button
              style={{ color: "white" }}
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Menu.Item>
        </Menu>
      </Header>

      {/* Main Content */}
      <Content className="app-content">
        {/* Welcome Banner */}
        <div className="app-banner">
          <Title
            style={{ color: "#00bba6" }}
            level={2}
            className="app-banner-title"
          >
            Welcome Back, User!
          </Title>
          <p className="app-banner-subtitle">
            Here's an overview of your workspace.
          </p>
        </div>

        {/* Cards Section */}
        <div className="app-cards">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Card
                className="app-card"
                headStyle={{
                  backgroundColor: "#00bba6", // Set your desired background color
                  color: "white", // Adjust the text color for contrast
                  fontWeight: "bold", // Optional: Add bold text
                }}
                title={
                  <>
                    <CheckSquareOutlined /> Your Tasks
                  </>
                }
                hoverable
              >
                <img
                  src="https://img.freepik.com/free-vector/giant-check-list_23-2148084003.jpg?ga=GA1.1.1731289663.1735821887&semt=ais_hybrid"
                  alt="Tasks"
                  className="card-image"
                />
                <p style={{ color: "#00bba6" }}>
                  Manage your tasks efficiently.
                </p>
                <p>Check deadlines and pending work.</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Link to="/viewfolders">
                <Card
                  className="app-card"
                  title={
                    <>
                      <FolderAddOutlined /> Folders
                    </>
                  }
                  hoverable
                  headStyle={{
                    backgroundColor: "#00bba6", // Set your desired background color
                    color: "white", // Adjust the text color for contrast
                    fontWeight: "bold", // Optional: Add bold text
                  }}
                >
                  <img
                    src="https://img.freepik.com/free-vector/events-concept-illustration_114360-27159.jpg?ga=GA1.1.1731289663.1735821887&semt=ais_hybrid"
                    alt="Folders"
                    className="card-image"
                  />
                  <p style={{ color: "#00bba6" }}>
                    View and organize your folders.
                  </p>
                  <p>Double-click to explore contents.</p>
                </Card>
              </Link>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Link to="/uploadImages">
                <Card
                  headStyle={{
                    backgroundColor: "#00bba6", // Set your desired background color
                    color: "white", // Adjust the text color for contrast
                    fontWeight: "bold", // Optional: Add bold text
                  }}
                  className="app-card"
                  title={
                    <>
                      <UploadOutlined /> Upload Images
                    </>
                  }
                  hoverable
                >
                  <img
                    src="https://img.freepik.com/free-vector/woman-choosing-dates-calendar-appointment-booking_23-2148552956.jpg?ga=GA1.1.1731289663.1735821887&semt=ais_hybrid"
                    alt="Upload"
                    className="card-image"
                  />
                  <p style={{ color: "#00bba6" }}>
                    Upload and manage your images.
                  </p>
                  <p>Drag and drop functionality available.</p>
                </Card>
              </Link>
            </Col>
          </Row>
        </div>

        {/* Calendar Section */}
        <div className="app-calendar">
          <Title
            style={{ color: "#00bba6" }}
            level={3}
            className="app-calendar-title"
          >
            Your Calendar
          </Title>
          <Calendar fullscreen={false} onPanelChange={onPanelChange} />
        </div>
      </Content>
    </Layout>
  );
};

export default App;
