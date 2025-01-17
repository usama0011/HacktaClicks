import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Checkbox,
  Button,
  Modal,
  Spin,
  message,
} from "antd";
import { DeleteOutlined, FolderOpenOutlined } from "@ant-design/icons";
import axiosInstance from "../components/BaseURL";
import "../styles/GetAllFolders.css";

const { Title } = Typography;

const GetAllFolders = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch folders from the API
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axiosInstance.get("/taskupload/users");
        if (!response.data.length) {
          message.info("No users or folders found.");
        }
        setFolders(response.data);
      } catch (error) {
        message.error("Failed to fetch folders.");
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  const handleFolderClick = (userId) => {
    console.log(userId);
    navigate(`/admindashboard/viewfolders/${userId}`);
  };
  // Select or deselect a folder
  const handleSelectFolder = (username) => {
    setSelectedFolders((prev) =>
      prev.includes(username)
        ? prev.filter((item) => item !== username)
        : [...prev, username]
    );
  };

  // Confirm and handle delete action
  const handleDelete = () => {
    if (deleteTarget) {
      console.log(`Deleting folders for user: ${deleteTarget}`);
    } else {
      console.log("Deleting selected folders:", selectedFolders);
    }
    setIsModalVisible(false);
    setSelectedFolders([]);
    setDeleteTarget(null);
  };

  // Open modal to confirm delete
  const confirmDelete = (username) => {
    setDeleteTarget(username);
    setIsModalVisible(true);
  };

  if (loading) {
    return (
      <div className="getallfolders-loading">
        <Spin tip="Loading folders..." size="large" />
      </div>
    );
  }

  return (
    <div className="getallfolders-container">
      <Title level={2} className="getallfolders-title">
        Admin: All Folders
      </Title>
      {folders.length === 0 ? (
        <p>No folders found.</p>
      ) : (
        <Row gutter={[16, 16]} justify="start">
          {folders.map((folder) => (
            <Col xs={24} sm={12} md={8} lg={6} key={folder._id}>
              <Card
                onClick={() => handleFolderClick(folder.userId)}
                className="getallfolders-folder-card"
                hoverable
              >
                <Checkbox
                  checked={selectedFolders.includes(folder.username)}
                  onChange={() => handleSelectFolder(folder.username)}
                  className="getallfolders-checkbox"
                />
                <FolderOpenOutlined className="getallfolders-folder-icon" />
                <p className="getallfolders-folder-name">{folder.username}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
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
          {deleteTarget
            ? ` all folders of user: ${deleteTarget}`
            : " the selected folders"}
          ?
        </p>
      </Modal>
    </div>
  );
};

export default GetAllFolders;
