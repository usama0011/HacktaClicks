// File: GetAllFolders.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Typography, Checkbox, Button, Modal } from "antd";
import { DeleteOutlined, FolderOpenOutlined } from "@ant-design/icons";
import "../styles/GetAllFolders.css";

const { Title } = Typography;

const folders = [
  { username: "usama", userFolders: ["2025-01-15", "2025-01-16"] },
  { username: "ahmed", userFolders: ["2025-01-14", "2025-01-17"] },
  { username: "sara", userFolders: ["2025-01-12", "2025-01-18"] },
];

const GetAllFolders = () => {
  const navigate = useNavigate();
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleFolderClick = (username) => {
    navigate(`/admin/user/${username}`); // Navigate to the user's folder
  };

  const handleSelectFolder = (username) => {
    setSelectedFolders((prev) =>
      prev.includes(username)
        ? prev.filter((item) => item !== username)
        : [...prev, username]
    );
  };

  const handleDelete = () => {
    if (deleteTarget) {
      // Simulate deletion
      console.log(`Deleting ${deleteTarget}`);
    } else {
      console.log("Deleting selected folders", selectedFolders);
    }
    setIsModalVisible(false);
    setSelectedFolders([]);
    setDeleteTarget(null);
  };

  const confirmDelete = (username) => {
    setDeleteTarget(username);
    setIsModalVisible(true);
  };

  return (
    <div className="getallfolders-container">
      <Title level={2} className="getallfolders-title">
        Admin: All Folders
      </Title>
      <Row gutter={[16, 16]} justify="start">
        {folders.map((folder) => (
          <Col xs={24} sm={12} md={8} lg={6} key={folder.username}>
            <Card
              className="getallfolders-folder-card"
              hoverable
              onDoubleClick={() => handleFolderClick(folder.username)}
            >
              <Checkbox
                checked={selectedFolders.includes(folder.username)}
                onChange={() => handleSelectFolder(folder.username)}
                className="getallfolders-checkbox"
              />
              <FolderOpenOutlined className="getallfolders-folder-icon" />
              <p className="getallfolders-folder-name">{folder.username}</p>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => confirmDelete(folder.username)}
              >
                Delete
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
      <Button
        type="primary"
        danger
        disabled={selectedFolders.length === 0}
        onClick={() => setIsModalVisible(true)}
        className="getallfolders-delete-selected"
      >
        Delete Selected
      </Button>

      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>
          Are you sure you want to delete
          {deleteTarget ? ` folder: ${deleteTarget}` : " the selected folders"}?
        </p>
      </Modal>
    </div>
  );
};

export default GetAllFolders;
