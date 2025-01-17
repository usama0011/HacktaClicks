import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Button, Image, Modal } from "antd";
import "../styles/FolderPreview.css";

const images = [
  {
    name: "studio.jpeg",
    src: "https://images.unsplash.com/photo-1735542214686-a745d3684c39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "meg.jpeg",
    src: "https://images.unsplash.com/photo-1735542214686-a745d3684c39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "yummy.jpeg",
    src: "https://images.unsplash.com/photo-1735542214686-a745d3684c39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const FolderPreview = () => {
  const { folderName } = useParams(); // Get the folder name from URL
  const navigate = useNavigate();
  const [previewVisible, setPreviewVisible] = useState(false); // Modal visibility state
  const [previewImage, setPreviewImage] = useState(""); // Image source for preview

  const handleImageClick = (src) => {
    setPreviewImage(src); // Set the clicked image
    setPreviewVisible(true); // Open the modal
  };

  const handleModalClose = () => {
    setPreviewVisible(false); // Close the modal
    setPreviewImage(""); // Clear the image
  };

  return (
    <div className="folderpreview-container">
      <div className="folderpreview-header">
        <h2 className="folderpreview-title">{folderName}</h2>
        <Button onClick={() => navigate(-1)} className="folderpreview-back">
          Back
        </Button>
      </div>
      <Row gutter={[16, 16]} justify="start">
        {images.map((image) => (
          <Col xs={24} sm={12} md={8} lg={6} key={image.name}>
            <Card
              className="folderpreview-image-card"
              hoverable
              onClick={() => handleImageClick(image.src)}
            >
              <div className="folderpreview-image-wrapper">
                <Image
                  src={image.src}
                  alt={image.name}
                  className="folderpreview-image"
                  preview={false} // Disable default Ant Design preview
                />
                <div className="folderpreview-overlay">Preview</div>
              </div>
              <p className="folderpreview-image-name">{image.name}</p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Full-Screen Image Preview Modal */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={handleModalClose}
        centered
        width="100%"
        bodyStyle={{
          padding: 0,
          margin: 0,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="folderpreview-modal"
      >
        <Image
          src={previewImage}
          alt="Preview"
          className="folderpreview-modal-image"
          preview={false}
          style={{
            maxWidth: "90%",
            width: "100%",
            height: "100%",
            maxHeight: "90%",
            objectFit: "contain",
          }}
        />
      </Modal>
    </div>
  );
};

export default FolderPreview;
