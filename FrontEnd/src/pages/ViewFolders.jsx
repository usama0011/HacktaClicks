import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  message,
  Spin,
  Tooltip,
  Pagination,
} from "antd";
import { FolderFilled } from "@ant-design/icons";
import axiosInstance from "../components/BaseURL";
import "../styles/ViewTasks.css";

const { Title, Text } = Typography;

const ViewFolders = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFolders, setTotalFolders] = useState(0);
  const [foldersPerPage, setFoldersPerPage] = useState(20);

  const fetchFolders = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
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
  }, [currentPage, foldersPerPage]);

  const handleFolderClick = (folderDate) => {
    navigate(`/tasks/${folderDate}`);
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
      <Title style={{ color: "#00bba6" }} level={2} className="viewtasks-title">
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
                onClick={() => handleFolderClick(folder.date)}
              >
                <div className="viewtasks-folder-icon">
                  <FolderFilled
                    style={{ fontSize: "64px", color: "#00bba6" }}
                  />
                </div>
                <Tooltip title={folder.date} placement="top">
                  <Text className="viewtasks-folder-name">{folder.date}</Text>
                </Tooltip>
              </Card>
            </Col>
          ))
        ) : (
          <Text className="viewtasks-no-folders">
            No folders available. Please add some tasks to view them here.
          </Text>
        )}
      </Row>

      <Pagination
        current={currentPage}
        total={totalFolders}
        pageSize={foldersPerPage}
        onChange={(page) => setCurrentPage(page)}
        showSizeChanger
        pageSizeOptions={["20", "30", "50", "100"]}
        onShowSizeChange={(current, size) => setFoldersPerPage(size)}
        style={{
          marginTop: "20px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

export default ViewFolders;
