import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Image, Spin, Typography, message } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import axiosInstance from "../components/BaseURL";
import "../styles/ViewImages.css";

const { Title } = Typography;

const AdminSideImagesView = () => {
  const { userId, folderDate } = useParams(); // Extract userId and folderDate from params
  console.log(userId, folderDate);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to validate and format the date
  const formatDateTime = (dateString) => {
    try {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      };
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      return date.toLocaleString("en-US", options); // Format date
    } catch (error) {
      return "Invalid date"; // Fallback for invalid date
    }
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
  }, [userId, folderDate]); // Depend on userId and folderDate params

  const handleImageClick = (imageId) => {
    navigate(`/admindashboard/image/details/${imageId}`);
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
      <Title level={2} className="viewimages-title">
        Images from {folderDate}
      </Title>
      <Row gutter={[16, 16]} justify="start">
        {images.map((image) => (
          <Col xs={24} sm={12} md={8} lg={6} key={image._id}>
            <Card
              className="viewimages-card"
              hoverable
              onClick={() => handleImageClick(image._id)}
            >
              <Image
                src={image.imageurl}
                alt={`Uploaded by ${image.username}`}
                className="viewimages-image"
              />
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#555", // Subtle text color
                  fontWeight: "500", // Slightly bold for emphasis
                }}
                className="viewimages-date"
              >
                <CalendarOutlined
                  style={{
                    marginRight: "8px",
                    color: "#1890ff", // Use a primary color for the icon
                    fontSize: "16px", // Slightly larger icon for better visibility
                  }}
                />
                <div style={{ fontStyle: "italic" }}>
                  {formatDateTime(image.createdAt)}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminSideImagesView;