import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import "../styles/UserFolder.css";

const { Title, Text } = Typography;

const UserFolder = () => {
  const { userId } = useParams(); // Get userId from URL params
  console.log(userId);
  const navigate = useNavigate();

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchFolders = async () => {
    try {
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
  }, [userId]);

  const handleFolderClick = (folderData) => {
    navigate(
      `/admindashboard/adminside/${folderData.userId}/folder/${folderData.date}`
    ); // Navigate to folder page
  };

  const handleSelectFolder = (folderDate) => {
    setSelectedFolders((prev) =>
      prev.includes(folderDate)
        ? prev.filter((item) => item !== folderDate)
        : [...prev, folderDate]
    );
  };

  const handleDelete = () => {
    if (deleteTarget) {
      console.log(`Deleting folder: ${deleteTarget}`);
    } else {
      console.log("Deleting selected folders:", selectedFolders);
    }
    setIsModalVisible(false);
    setSelectedFolders([]);
    setDeleteTarget(null);
  };

  const confirmDelete = (folderDate) => {
    setDeleteTarget(folderDate);
    setIsModalVisible(true);
  };
  console.log(folders);
  if (loading) {
    return (
      <div className="userfolder-loading">
        <Spin tip="Loading Folders..." size="large" />
      </div>
    );
  }

  return (
    <div className="userfolder-container">
      <Title level={2} className="userfolder-title">
        User ID: {userId}
      </Title>
      <Row gutter={[16, 16]} justify="start">
        {folders.length > 0 ? (
          folders.map((folder) => (
            <Col xs={24} sm={12} md={8} lg={6} key={folder.date}>
              <Card
                className="userfolder-folder-card"
                hoverable
                onClick={() => handleFolderClick(folder)}
              >
                <Checkbox
                  checked={selectedFolders.includes(folder.date)}
                  onChange={() => handleSelectFolder(folder.date)}
                  className="userfolder-checkbox"
                />
                <FolderOpenOutlined className="userfolder-folder-icon" />
                <Text className="userfolder-folder-name">{folder.date}</Text>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => confirmDelete(folder.date)}
                >
                  Delete
                </Button>
              </Card>
            </Col>
          ))
        ) : (
          <Text className="userfolder-no-folders">
            No folders available for this user.
          </Text>
        )}
      </Row>
      <Button
        type="primary"
        danger
        disabled={selectedFolders.length === 0}
        onClick={() => setIsModalVisible(true)}
        className="userfolder-delete-selected"
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

export default UserFolder;
