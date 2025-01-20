// AdminSideImagesView Component with Next/Previous Buttons
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const AdminSideImagesView = () => {
  const { userId, folderDate } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showImagePreview = (index) => {
    setCurrentImageIndex(index);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const fetchImages = async () => {
    try {
      const response = await axiosInstance.get(
        `/taskupload/user/${userId}/folder/${folderDate}`
      );
      setImages(response.data);
    } catch (error) {
      message.error(error.message || "Failed to fetch images for the folder.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [userId, folderDate]);

  if (loading) {
    return (
      <div className="viewimages-loading">
        <Spin tip="Loading Images..." size="large" />
      </div>
    );
  }
  console.log(images);

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
            {images?.length}
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
