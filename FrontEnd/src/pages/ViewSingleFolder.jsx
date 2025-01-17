import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Checkbox, Card, Modal, Image, Button } from "antd";
import "../styles/ViewImages.css";

const images = [
  {
    name: "image1.jpg",
    src: "https://images.unsplash.com/photo-1736185669739-36a8e70cb6c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNnx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "image2.jpg",
    src: "https://images.unsplash.com/photo-1736185669739-36a8e70cb6c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNnx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "image3.jpg",
    src: "https://images.unsplash.com/photo-1736185669739-36a8e70cb6c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNnx8fGVufDB8fHx8fA%3D%3D",
  },
];

const ViewImages = () => {
  const { dateFolder } = useParams();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleImageClick = (src) => {
    setPreviewImage(src);
    setPreviewVisible(true);
  };

  const handleModalClose = () => {
    setPreviewVisible(false);
    setPreviewImage("");
  };

  const handleSelectImage = (name) => {
    setSelectedImages((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const handleDelete = () => {
    console.log("Deleting selected images:", selectedImages);
    setIsModalVisible(false);
    setSelectedImages([]);
  };

  return (
    <div className="viewimages-container">
      <h2 className="viewimages-title">Images from {dateFolder}</h2>
      <Row gutter={[16, 16]} justify="start">
        {images.map((image) => (
          <Col xs={24} sm={12} md={8} lg={6} key={image.name}>
            <Card className="viewimages-card" hoverable>
              <Image
                src={image.src}
                alt={image.name}
                className="viewimages-image"
                preview={false}
                onClick={() => handleImageClick(image.src)}
              />
              <div className="viewimages-footer">
                <Checkbox
                  checked={selectedImages.includes(image.name)}
                  onChange={() => handleSelectImage(image.name)}
                  className="viewimages-checkbox"
                />
              </div>
              <p className="viewimages-name">{image.name}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Button
        type="primary"
        danger
        disabled={selectedImages.length === 0}
        onClick={() => setIsModalVisible(true)}
        className="viewimages-delete-selected"
      >
        Delete Selected
      </Button>

      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Are you sure you want to delete the selected images?</p>
      </Modal>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={handleModalClose}
        centered
        width="80%"
        bodyStyle={{ textAlign: "center" }}
      >
        <Image
          src={previewImage}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: "80vh" }}
        />
      </Modal>
    </div>
  );
};

export default ViewImages;
