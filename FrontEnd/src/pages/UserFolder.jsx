import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Checkbox, Button, Modal } from "antd";
import { DeleteOutlined, FolderOpenOutlined } from "@ant-design/icons";
import "../styles/UserFolder.css";

const UserFolder = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const folders = ["2025-01-15", "2025-01-16", "2025-01-17"]; // Dummy folders
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleFolderClick = (dateFolder) => {
    navigate(`/admin/user/${username}/folder/${dateFolder}`);
  };

  const handleSelectFolder = (dateFolder) => {
    setSelectedFolders((prev) =>
      prev.includes(dateFolder)
        ? prev.filter((item) => item !== dateFolder)
        : [...prev, dateFolder]
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

  const confirmDelete = (dateFolder) => {
    setDeleteTarget(dateFolder);
    setIsModalVisible(true);
  };

  return (
    <div className="userfolder-container">
      <h2 className="userfolder-title">{username}'s Folders</h2>
      <Row gutter={[16, 16]} justify="start">
        {folders.map((folder) => (
          <Col xs={24} sm={12} md={8} lg={6} key={folder}>
            <Card
              className="userfolder-folder-card"
              hoverable
              onDoubleClick={() => handleFolderClick(folder)}
            >
              <Checkbox
                checked={selectedFolders.includes(folder)}
                onChange={() => handleSelectFolder(folder)}
                className="userfolder-checkbox"
              />
              <FolderOpenOutlined className="userfolder-folder-icon" />
              <p className="userfolder-folder-name">{folder}</p>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => confirmDelete(folder)}
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
