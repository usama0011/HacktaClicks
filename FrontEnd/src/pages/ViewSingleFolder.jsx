import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Card, Image, Spin, Typography, message } from "antd";
import axiosInstance from "../components/BaseURL";
import "../styles/ViewImages.css";

const { Title } = Typography;

const ViewImages = () => {
  const { dateFolder } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to validate and format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null; // Invalid date
    }
    return date.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD' format
  };

  const fetchImages = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id; // Get user ID from localStorage

      // Format the date
      const formattedDate = formatDate(dateFolder);
      if (!formattedDate) {
        throw new Error("Invalid date format in the URL");
      }

      const response = await axiosInstance.get(
        `/taskupload/user/${userId}/folder/${formattedDate}`
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
  }, [dateFolder]);

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
        Images from {dateFolder}
      </Title>
      <Row gutter={[16, 16]} justify="start">
        {images.map((image) => (
          <Col xs={24} sm={12} md={8} lg={6} key={image._id}>
            <Card className="viewimages-card" hoverable>
              <Image
                src={image.imageurl}
                alt={image.username}
                className="viewimages-image"
                preview={false}
              />
              <p className="viewimages-name">{image.username}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ViewImages;
