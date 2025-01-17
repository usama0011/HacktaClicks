import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Typography } from "antd";
import { FolderFilled } from "@ant-design/icons"; // Using Ant Design's Folder Icon
import "../styles/ViewTasks.css";

const { Text } = Typography;

const folders = [
  "2025-01-15",
  "2025-01-16",
  "2025-01-17",
  "2025-01-18",
  "2025-01-19",
];

const ViewFolders = () => {
  const navigate = useNavigate();

  const handleDoubleClick = (folderName) => {
    navigate(`/tasks/${folderName}`); // Navigate to the route
  };

  return (
    <div className="viewtasks-container">
      <h2 className="viewtasks-title">Manage Your Tasks</h2>
      <p className="viewtasks-subtitle">
        A comfortable way to access your tasks by date.
      </p>
      <Row gutter={[24, 24]} justify="center">
        {folders.map((folder) => (
          <Col xs={24} sm={12} md={8} lg={6} key={folder}>
            <Card
              className="viewtasks-folder"
              hoverable
              onDoubleClick={() => handleDoubleClick(folder)}
            >
              <div className="viewtasks-folder-icon">
                <FolderFilled style={{ fontSize: "64px", color: "#43e97b" }} />
              </div>
              <Text className="viewtasks-folder-name">{folder}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ViewFolders;
