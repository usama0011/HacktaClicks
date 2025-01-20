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
  Input,
  Pagination,
  message,
} from "antd";
import { DeleteOutlined, FolderOpenOutlined } from "@ant-design/icons";
import axiosInstance from "../components/BaseURL";
import "../styles/UserFolder.css";

const { Title, Text } = Typography;

const UserFolder = () => {
  const { userId } = useParams(); // Get userId from URL params
  const navigate = useNavigate();

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFolders, setTotalFolders] = useState(0);
  const [foldersPerPage, setFoldersPerPage] = useState(20);

  const correctPassword = "muix@123";

  const fetchFolders = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/taskupload/user/${userId}/folders?page=${page}&limit=${limit}`
      );
      const { folders, total } = response.data;
      setFolders(folders);
      setTotalFolders(total);
    } catch (error) {
      message.error("Failed to fetch folders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders(currentPage, foldersPerPage);
  }, [userId, currentPage, foldersPerPage]);

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

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/taskupload/user/${userId}/folders`,
        { data: { dates: selectedFolders } }
      );
      message.success(response.data.message);
      fetchFolders(currentPage, foldersPerPage); // Refresh folders after deletion
    } catch (error) {
      message.error("Failed to delete folders.");
    } finally {
      setDeleteLoading(false);
      setIsPasswordModalVisible(false);
      setSelectedFolders([]);
      setPassword(""); // Reset password input
    }
  };

  const confirmDelete = () => {
    setIsPasswordModalVisible(true);
  };

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      message.success("Password verified successfully!");
      setIsPasswordModalVisible(false);
      setIsModalVisible(true); // Show deletion confirmation modal
    } else {
      message.error("Incorrect password. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="userfolder-loading">
        <Spin tip="Loading Folders..." size="large" />
      </div>
    );
  }

  return (
    <div className="userfolder-container">
      <Title
        style={{
          textAlign: "center",
          color: "#00bba6",
          textDecoration: "underline",
        }}
        level={2}
      >
        Manage Folders
      </Title>
      <Row gutter={[16, 16]} justify="start">
        {folders.length > 0 ? (
          folders.map((folder) => (
            <Col xs={24} sm={12} md={8} lg={6} key={folder.date}>
              <Card className="userfolder-folder-card" hoverable>
                <Checkbox
                  checked={selectedFolders.includes(folder.date)}
                  onChange={() => handleSelectFolder(folder.date)}
                  className="userfolder-checkbox"
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <FolderOpenOutlined className="userfolder-folder-icon" />
                  <Text
                    style={{ textDecoration: "underline" }}
                    onClick={() => handleFolderClick(folder)}
                    className="userfolder-folder-name"
                  >
                    {folder.date}
                  </Text>
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <Text>No folders available for this user.</Text>
        )}
      </Row>
      <Button
        type="primary"
        danger
        disabled={selectedFolders.length === 0}
        onClick={confirmDelete}
        className="userfolder-delete-selected"
      >
        Delete Selected
      </Button>

      <Pagination
        current={currentPage}
        total={totalFolders}
        pageSize={foldersPerPage}
        onChange={(page) => setCurrentPage(page)}
        showSizeChanger
        pageSizeOptions={["20", "30", "50", "100"]}
        onShowSizeChange={(current, size) => setFoldersPerPage(size)}
        style={{ marginTop: "20px", textAlign: "center" }}
      />

      {/* Password Modal */}
      <Modal
        title="Enter Password"
        visible={isPasswordModalVisible}
        onOk={handlePasswordSubmit}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          setPassword(""); // Reset password input
        }}
        okText="Submit"
        cancelText="Cancel"
      >
        <Input.Password
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Modal>

      {/* Deletion Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={deleteLoading}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete the selected folders? This action
          cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default UserFolder;
