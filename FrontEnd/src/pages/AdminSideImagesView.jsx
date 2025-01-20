import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Image,
  Modal,
  Button,
  Typography,
  Spin,
  message,
  Pagination,
  Select,
} from "antd";
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  PictureOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import axiosInstance from "../components/BaseURL";
import "../styles/ViewImages.css";

const { Title } = Typography;
const { Option } = Select;

const AdminSideImagesView = () => {
  const { userId, folderDate } = useParams();
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
      const response = await axiosInstance.get(
        `/taskupload/user/${userId}/folder/${folderDate}?page=${page}&limit=${limit}`
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
  }, [userId, folderDate, currentPage, entriesPerPage]);

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
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 1000,
        }}
      >
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
        {/* Left Side: Image Count with Icon */}
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
          <span style={{ color: "#00bba6", fontSize: "24px" }}>Images</span>
        </div>

        {/* Right Side: Folder Name with Icon */}
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
            {folderDate}
          </span>
          <span style={{ color: "#00bba6", fontSize: "24px" }}>Folder</span>
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
                alt={`Uploaded by ${image.username}`}
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
                className="viewimages-date"
              >
                <CalendarOutlined
                  style={{
                    marginRight: "8px",
                    color: "#00bba6",
                    fontSize: "16px",
                  }}
                />
                <div style={{ fontStyle: "italic", color: "#333" }}>
                  {new Date(image.createdAt).toLocaleString()}
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

      {/* Modal for Image Preview */}
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

export default AdminSideImagesView;
