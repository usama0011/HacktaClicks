import "../styles/Welcome.css";
import React from "react";
import { Row, Col, Card, Typography } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FolderOutlined,
  UploadOutlined,
  SettingOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const WelcomeAdminDashboardPage = () => {
  return (
    <div className="welcome-container">
      <Title level={2} className="welcome-title">
        Welcome to the Admin Dashboard
      </Title>
      <Paragraph className="welcome-subtitle">
        Access your tools and manage your system effectively.
      </Paragraph>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="welcome-card" hoverable>
            <DashboardOutlined className="welcome-card-icon" />
            <Title level={4} className="welcome-card-title">
              Overview
            </Title>
            <Paragraph className="welcome-card-description">
              View system metrics and stats.
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="welcome-card" hoverable>
            <UserOutlined className="welcome-card-icon" />
            <Title level={4} className="welcome-card-title">
              Users
            </Title>
            <Paragraph className="welcome-card-description">
              Manage all registered users.
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="welcome-card" hoverable>
            <FolderOutlined className="welcome-card-icon" />
            <Title level={4} className="welcome-card-title">
              Folders
            </Title>
            <Paragraph className="welcome-card-description">
              Organize and review folders.
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="welcome-card" hoverable>
            <UploadOutlined className="welcome-card-icon" />
            <Title level={4} className="welcome-card-title">
              Uploads
            </Title>
            <Paragraph className="welcome-card-description">
              Monitor recent uploads.
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="welcome-card" hoverable>
            <BarChartOutlined className="welcome-card-icon" />
            <Title level={4} className="welcome-card-title">
              Reports
            </Title>
            <Paragraph className="welcome-card-description">
              Analyze reports and insights.
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="welcome-card" hoverable>
            <SettingOutlined className="welcome-card-icon" />
            <Title level={4} className="welcome-card-title">
              Settings
            </Title>
            <Paragraph className="welcome-card-description">
              Adjust your system preferences.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default WelcomeAdminDashboardPage;
