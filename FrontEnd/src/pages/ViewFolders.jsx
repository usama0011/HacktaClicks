import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Typography, message, Spin } from "antd";
import { FolderFilled } from "@ant-design/icons";
import axiosInstance from "../components/BaseURL"; // Import Axios Instance
import "../styles/ViewTasks.css";

const { Title, Text } = Typography;

const ViewFolders = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFolders = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id; // Get user ID from localStorage
      console.log(userId);
      const response = await axiosInstance.get(
        `/taskupload/user/${userId}/folders`
      );
      setFolders(response.data);
    } catch (error) {
      message.error("Failed to fetch folders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleDoubleClick = (folderDate) => {
    navigate(`/tasks/${folderDate}`); // Navigate to folder
  };

  if (loading) {
    return (
      <div className="viewtasks-loading">
        <Spin tip="Loading Folders..." size="large" />
      </div>
    );
  }

  return (
    <div className="viewtasks-container">
      <Title level={2} className="viewtasks-title">
        Manage Your Tasks
      </Title>
      <p className="viewtasks-subtitle">
        Easily access and manage your tasks organized by date.
      </p>
      <Row gutter={[24, 24]} justify="center">
        {folders.length > 0 ? (
          folders.map((folder) => (
            <Col xs={24} sm={12} md={8} lg={6} key={folder.date}>
              <Card
                className="viewtasks-folder"
                hoverable
                onDoubleClick={() => handleDoubleClick(folder.date)}
              >
                <div className="viewtasks-folder-icon">
                  <FolderFilled
                    style={{ fontSize: "64px", color: "#43e97b" }}
                  />
                </div>
                <Text className="viewtasks-folder-name">{folder.date}</Text>
              </Card>
            </Col>
          ))
        ) : (
          <Text className="viewtasks-no-folders">
            No folders available. Please add some tasks to view them here.
          </Text>
        )}
      </Row>
    </div>
  );
};

export default ViewFolders;
