import React, { useContext, useState } from "react";
import { Upload, Button, Progress, message, Card, Row, Col, Image } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import "../styles/UploadImage.css";
import { UserContext } from "../context/UserContext";

const { Dragger } = Upload;

const UploadImages = () => {
  const { user } = useContext(UserContext); // Get user data from context
  const [fileList, setFileList] = useState([]); // Track files
  const [uploading, setUploading] = useState(false); // Track upload state
  const [progress, setProgress] = useState(0); // Track progress
  const [previewImage, setPreviewImage] = useState(null); // Preview image

  const handleUploadToCloudinary = async () => {
    if (fileList.length === 0) {
      message.warning("Please select a file to upload!");
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", fileList[0]);
    formData.append("upload_preset", "hacktaclicks"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dovmnsimj/image/upload", // Replace with your Cloudinary cloud name
        formData,
        {
          onUploadProgress: (event) => {
            const percentCompleted = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      const imageUrl = response.data.secure_url;
      message.success("Image uploaded to Cloudinary successfully!");

      // Submit to your backend
      await handleUploadToBackend(imageUrl);
    } catch (error) {
      message.error("Failed to upload image to Cloudinary.");
    } finally {
      setUploading(false);
      setFileList([]);
      setPreviewImage(null);
    }
  };

  const handleUploadToBackend = async (imageUrl) => {
    try {
      const taskData = {
        userId: user?.id, // From context
        username: user?.username, // From context
        imageurl: imageUrl,
        shift: user?.shift,
      };

      const response = await axios.post(
        "http://localhost:5000/api/taskupload",
        taskData
      );
      message.success("Image URL uploaded to the backend successfully!");
      console.log("Backend Response:", response.data);
    } catch (error) {
      message.error("Failed to upload image URL to the backend.");
    }
  };

  const draggerProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      setFileList([file]);
      setPreviewImage(URL.createObjectURL(file));
      return false; // Prevent default upload behavior
    },
    onRemove: () => {
      setFileList([]);
      setPreviewImage(null);
    },
    fileList,
    showUploadList: true,
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Your Image</h2>
      <p className="upload-description">
        Drag and drop your image here or click to select an image to upload.
      </p>

      <Row justify="center">
        <Col xs={24} sm={18} md={16} lg={12}>
          <Card className="upload-card">
            <Dragger {...draggerProps} className="upload-dragger">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Drag and drop your image here</p>
              <p className="ant-upload-hint">Or click to select an image</p>
            </Dragger>

            {previewImage && (
              <div className="upload-preview">
                <Image
                  src={previewImage}
                  alt="Preview"
                  className="upload-preview-image"
                />
              </div>
            )}

            {uploading && (
              <Progress
                percent={progress}
                status={progress < 100 ? "active" : "success"}
                className="upload-progress"
              />
            )}

            <Button
              type="primary"
              onClick={handleUploadToCloudinary}
              className="upload-button"
              loading={uploading}
              disabled={fileList.length === 0}
              block
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UploadImages;
