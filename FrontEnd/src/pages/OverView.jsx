import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, Spin, message } from "antd";
import { UserOutlined, PictureOutlined, TeamOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axiosInstance from "../components/BaseURL";
import "../styles/OverView.css";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const OverView = () => {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({});
  const [screenshotStats, setScreenshotStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, screenshotResponse] = await Promise.all([
          axiosInstance.get("/users/stats/users"),
          axiosInstance.get("/users/stats/screenshots"),
        ]);

        setUserStats(userResponse.data);
        setScreenshotStats(screenshotResponse.data);
        setLoading(false);
      } catch (error) {
        message.error("Failed to fetch overview data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="overview-loading">
        <Spin tip="Loading Overview..." size="large" />
      </div>
    );
  }

  return (
    <div className="overview-container">
      <Title level={2} className="overview-title">
        Admin Dashboard Overview
      </Title>

      <Row gutter={[16, 16]}>
        {/* Total Registered Users */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="overview-card">
            <UserOutlined className="overview-icon" />
            <Title level={4} className="overview-card-title">
              Total Users
            </Title>
            <Text className="overview-card-value">
              {userStats.totalUsers?.toLocaleString()}
            </Text>

            <div className="overview-breakdown">
              <div className="overview-breakdown-item">
                <img
                  src="https://img.icons8.com/?size=80&id=hRO2tnq9heu6&format=png"
                  alt=""
                  style={{
                    width: "50px",
                    marginRight: "20px",
                    height: "50px",
                    objectFit: "cover",
                    backgroundSize: "cover",
                  }}
                />
                <span style={{ fontWeight: "bold" }}> Morning:</span>
                {userStats.morningUsers}
              </div>
              <div className="overview-breakdown-item">
                <img
                  src="https://img.icons8.com/?size=48&id=22977&format=png"
                  alt=""
                  style={{
                    width: "50px",
                    marginRight: "20px",
                    height: "50px",
                    objectFit: "cover",
                    backgroundSize: "cover",
                  }}
                />
                <span style={{ fontWeight: "bold" }}> Evening:</span>{" "}
                {userStats.eveningUsers}
              </div>
              <div className="overview-breakdown-item">
                <img
                  src="https://img.icons8.com/?size=48&id=15348&format=png"
                  alt=""
                  style={{
                    width: "50px",
                    marginRight: "20px",
                    height: "50px",
                    objectFit: "cover",
                    backgroundSize: "cover",
                  }}
                />
                <span style={{ fontWeight: "bold" }}> Night:</span>{" "}
                {userStats.nightUsers}
              </div>
            </div>
          </Card>
        </Col>

        {/* Total Screenshots */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="overview-card">
            <PictureOutlined className="overview-icon" />
            <Title level={4} className="overview-card-title">
              Screenshots Taken
            </Title>
            <Text className="overview-card-value">
              {screenshotStats?.totalScreenshots.toLocaleString()}
            </Text>
            <div className="overview-breakdown">
              <div className="overview-breakdown-item">
                <img
                  src="https://img.icons8.com/?size=80&id=hRO2tnq9heu6&format=png"
                  alt=""
                  style={{
                    width: "50px",
                    marginRight: "20px",
                    height: "50px",
                    objectFit: "cover",
                    backgroundSize: "cover",
                  }}
                />
                <span style={{ fontWeight: "bold" }}> Morning:</span>{" "}
                {screenshotStats.morningScreenshots}
              </div>
              <div className="overview-breakdown-item">
                <img
                  src="https://img.icons8.com/?size=48&id=22977&format=png"
                  alt=""
                  style={{
                    width: "50px",
                    marginRight: "20px",
                    height: "50px",
                    objectFit: "cover",
                    backgroundSize: "cover",
                  }}
                />
                <span style={{ fontWeight: "bold" }}> Evening:</span>{" "}
                {screenshotStats.eveningScreenshots}
              </div>
              <div className="overview-breakdown-item">
                <img
                  src="https://img.icons8.com/?size=48&id=15348&format=png"
                  alt=""
                  style={{
                    width: "50px",
                    marginRight: "20px",
                    height: "50px",
                    objectFit: "cover",
                    backgroundSize: "cover",
                  }}
                />
                <span style={{ fontWeight: "bold" }}> Night:</span>{" "}
                {screenshotStats.nightScreenshots}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card style={{ minHeight: "387px" }} className="overview-card">
            <Link
              to="/admindashboard/hourly-reports/morning"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src="https://img.icons8.com/ios-filled/50/000000/clock.png"
                alt="Morning Report"
                style={{ width: "50px", marginRight: "20px" }}
              />
              <Title style={{ textDecoration: "underline" }} level={4}>
                Morning Report
              </Title>
            </Link>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card style={{ minHeight: "387px" }} className="overview-card">
            <Link
              to="/admindashboard/hourly-reports/evening"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src="https://img.icons8.com/ios-filled/50/000000/clock.png"
                alt="Evening Report"
                style={{ width: "50px", marginRight: "20px" }}
              />
              <Title style={{ textDecoration: "underline" }} level={4}>
                Evening Report
              </Title>
            </Link>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card style={{ minHeight: "387px" }} className="overview-card">
            <Link
              to="/admindashboard/hourly-reports/night"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src="https://img.icons8.com/ios-filled/50/000000/clock.png"
                alt="Night Report"
                style={{ width: "50px", marginRight: "20px" }}
              />
              <Title style={{ textDecoration: "underline" }} level={4}>
                Night Report
              </Title>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverView;
