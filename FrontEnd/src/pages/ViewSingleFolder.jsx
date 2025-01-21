import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Image,
  Spin,
  Typography,
  message,
  Button,
  Modal,
  Pagination,
  Select,
} from "antd";
import {
  CalendarOutlined,
  PictureOutlined,
  FolderOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import axiosInstance from "../components/BaseURL";
import "../styles/ViewImages.css";

const { Title } = Typography;
const { Option } = Select;

const ViewImages = () => {
  const { folderName } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(20);

  const fetchImages = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const response = await axiosInstance.get(
        `/taskupload/user/${userId}/folder/${folderName}?page=${page}&limit=${limit}`
      );
      const { images, total, totalPages } = response.data;
      setImages(images);
      setTotalEntries(total);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      message.error(error.message || "Failed to fetch images for the folder.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(currentPage, entriesPerPage);
  }, [folderName, currentPage, entriesPerPage]);

  const showImagePreview = (index) => {
    setCurrentImageIndex(index);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEntriesPerPageChange = (value) => {
    setEntriesPerPage(value);
    setCurrentPage(1); // Reset to first page
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="viewimages-loading">
        <Spin tip="Loading Images..." size="large" />
      </div>
    );
  }

  return (
    <div className="viewimages-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <PictureOutlined
            style={{ color: "#00bba6", fontSize: "24px", marginRight: "8px" }}
          />
          <span
            style={{
              color: "#00bba6",
              fontWeight: "bold",
              fontSize: "27px",
              textDecoration: "underline",
              marginRight: "8px",
            }}
          >
            {totalEntries}
          </span>
          <span style={{ color: "#555", fontSize: "24px" }}>Images</span>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <FolderOutlined
            style={{ color: "#00bba6", fontSize: "24px", marginRight: "8px" }}
          />
          <span
            style={{
              color: "#00bba6",
              fontWeight: "bold",
              fontSize: "27px",
              textDecoration: "underline",
              marginRight: "8px",
            }}
          >
            {folderName}
          </span>
          <span style={{ color: "#555", fontSize: "24px" }}>Folder</span>
        </div>
      </div>

      <Row gutter={[16, 16]} justify="start">
        {images.map((image, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={image._id}>
            <Card
              className="viewimages-card"
              hoverable
              onClick={() => showImagePreview(index)}
            >
              <Image
                src={image.imageurl}
                alt={image.createdAt}
                className="viewimages-image"
                preview={false}
              />
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#555",
                  fontWeight: "500",
                }}
              >
                <CalendarOutlined
                  style={{
                    marginRight: "8px",
                    color: "#1890ff",
                    fontSize: "16px",
                  }}
                />
                <div
                  style={{
                    fontStyle: "italic",
                    color: "#333",
                    textDecoration: "underline",
                  }}
                >
                  {new Date(image.createdAt).toLocaleString("en-US", {
                    weekday: "short", // Tue
                    year: "numeric", // 2025
                    month: "short", // Jan
                    day: "2-digit", // 21
                    hour: "2-digit", // 11
                    minute: "2-digit", // 07
                    hour12: true, // AM/PM format
                  })}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Select defaultValue={20} onChange={handleEntriesPerPageChange}>
          <Option value={20}>20</Option>
          <Option value={30}>30</Option>
          <Option value={50}>50</Option>
          <Option value={100}>100</Option>
        </Select>
        <Pagination
          current={currentPage}
          total={totalEntries}
          pageSize={entriesPerPage}
          onChange={handlePageChange}
        />
      </div>

      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={closeModal}
        centered
        width={800}
        bodyStyle={{ textAlign: "center" }}
      >
        <Button
          icon={<LeftOutlined />}
          onClick={showPreviousImage}
          style={{ position: "absolute", left: 10, top: "50%", zIndex: 1000 }}
        />
        <Image
          src={images[currentImageIndex]?.imageurl}
          alt="Preview"
          style={{ maxHeight: "70vh", objectFit: "contain" }}
        />
        <Button
          icon={<RightOutlined />}
          onClick={showNextImage}
          style={{ position: "absolute", right: 10, top: "50%", zIndex: 1000 }}
        />
      </Modal>
    </div>
  );
};

export default ViewImages;
