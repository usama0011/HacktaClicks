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
  Input,
  Select,
  Pagination,
} from "antd";
import {
  DeleteOutlined,
  FolderOpenOutlined,
  SearchOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import axiosInstance from "../components/BaseURL";
import "../styles/GetAllFolders.css";

const { Title } = Typography;
const { Option } = Select;

const GetAllFolders = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");
  const [filterShift, setFilterShift] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [totalEntries, setTotalEntries] = useState(0);

  // Fetch folders from the API with pagination
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/taskupload/users?page=${currentPage}&limit=${entriesPerPage}`
        );
        const { data, total } = response.data;

        if (!data.length) {
          message.info("No users or folders found.");
        }

        setFolders(data);
        setFilteredFolders(data);
        setTotalEntries(total);
      } catch (error) {
        message.error("Failed to fetch folders.");
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [currentPage, entriesPerPage]);

  const handleFolderClick = (userId) => {
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

  // Handle search and filter
  const handleSearch = () => {
    const filtered = folders.filter((folder) => {
      const matchesUsername = searchUsername
        ? folder.username.toLowerCase().includes(searchUsername.toLowerCase())
        : true;
      const matchesShift = filterShift ? folder.shift === filterShift : true;
      return matchesUsername && matchesShift;
    });
    setFilteredFolders(filtered);
    setTotalEntries(filtered.length); // Update total entries for filtered data
    setCurrentPage(1); // Reset to the first page when filtering
  };

  // Automatically reset filters when clearing input or dropdown
  const handleResetFilters = () => {
    setSearchUsername("");
    setFilterShift("");
    setFilteredFolders(folders);
    setTotalEntries(folders.length); // Reset total entries to original count
    setCurrentPage(1); // Reset to the first page
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
      <Title
        level={2}
        className="getallfolders-title"
        style={{ color: "#00bba6" }}
      >
        <FolderOutlined style={{ color: "#00bba6" }} /> Admin: All Folders{" "}
        <span
          className="folder-count"
          style={{ color: "#00bba6", textDecoration: "underline" }}
        >
          (Total: {totalEntries})
        </span>
      </Title>

      {/* Filters */}
      <Row gutter={[16, 16]} className="getallfolders-filters">
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Search by username"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
            onClear={handleResetFilters} // Automatically reset filters on clear
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            style={{ minWidth: "200px" }}
            placeholder="Filter by shift"
            value={filterShift}
            onChange={(value) => setFilterShift(value)}
            allowClear
            onClear={handleResetFilters} // Automatically reset filters on clear
          >
            <Option value="morning">Morning</Option>
            <Option value="evening">Evening</Option>
            <Option value="night">Night</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Button
            type="primary"
            style={{ backgroundColor: "#00bba6" }}
            onClick={handleSearch}
            block
          >
            Search
          </Button>
        </Col>
      </Row>

      {filteredFolders.length === 0 ? (
        <p>No folders found.</p>
      ) : (
        <Row gutter={[16, 16]} justify="start">
          {filteredFolders.map((folder) => (
            <Col xs={24} sm={12} md={8} lg={6} key={folder.userId}>
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
                <p className="getallfolders-folder-name">
                  {folder.username.length > 30
                    ? `${folder.username.slice(0, 25)}...`
                    : folder.username}
                </p>
                <p className="getallfolders-folder-shift">
                  Shift: {folder.shift}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Pagination
        current={currentPage}
        total={totalEntries}
        pageSize={entriesPerPage}
        onChange={(page) => setCurrentPage(page)}
        showSizeChanger
        pageSizeOptions={["20", "30", "50", "100"]}
        onShowSizeChange={(current, size) => setEntriesPerPage(size)}
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />

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
