import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, Spin, message } from "antd";
import {
  UserOutlined,
  PictureOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "../styles/OverView.css";

const { Title, Text } = Typography;

const OverView = () => {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    morningUsers: 0,
    eveningUsers: 0,
    nightUsers: 0,
    totalScreenshots: 0,
    totalTeams: 10,
    morningTeams: 4,
    eveningTeams: 3,
    nightTeams: 3,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call to fetch statistics
        setTimeout(() => {
          setUserStats({
            totalUsers: 150,
            morningUsers: 50,
            eveningUsers: 60,
            nightUsers: 40,
            totalScreenshots: 300,
            totalTeams: 10,
            morningTeams: 4,
            eveningTeams: 3,
            nightTeams: 3,
          });
          setLoading(false);
        }, 1000);
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
            <Text className="overview-card-value">{userStats.totalUsers}</Text>
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
                Morning: {userStats.morningUsers}
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
                Evening: {userStats.eveningUsers}
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
                Night: {userStats.nightUsers}
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
              {userStats.totalScreenshots}
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
                Morning: 100
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
                Evening: 120
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
                Night: 80
              </div>
            </div>
          </Card>
        </Col>

        {/* Active Teams */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="overview-card">
            <TeamOutlined className="overview-icon" />
            <Title level={4} className="overview-card-title">
              Active Teams
            </Title>
            <Text className="overview-card-value">{userStats.totalTeams}</Text>
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
                Morning: {userStats.morningTeams}
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
                Evening: {userStats.eveningTeams}
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
                Night: {userStats.nightTeams}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverView;
