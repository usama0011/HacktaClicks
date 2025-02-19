import React, { useContext, useState } from "react";
import {
  Upload,
  Button,
  Progress,
  message,
  Card,
  Row,
  Col,
  Image,
  Modal,
} from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import imageCompression from "browser-image-compression"; // Image compression library
import "../styles/UploadImage.css";
import { UserContext } from "../context/UserContext";

const { Dragger } = Upload;

const UploadImages = () => {
  const { user } = useContext(UserContext);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCompressImage = async (file) => {
    const options = {
      maxSizeMB: 0.5, // Target size increased to 0.5 MB
      maxWidthOrHeight: 1920, // Maintain aspect ratio
      useWebWorker: true, // Enable web worker
      initialQuality: 0.8, // Set initial quality to avoid over-compression
    };

    try {
      setCompressing(true);
      const compressedFile = await imageCompression(file, options);
      setCompressedImage(compressedFile);
      setOriginalSize((file.size / 1024).toFixed(2)); // Convert to KB
      setCompressedSize((compressedFile.size / 1024).toFixed(2)); // Convert to KB
      setPreviewImage(URL.createObjectURL(compressedFile));
      setIsModalVisible(true);
    } catch (error) {
      message.error("Failed to compress image.");
    } finally {
      setCompressing(false);
    }
  };

  const handleUploadToCloudinary = async () => {
    if (!compressedImage) {
      message.warning("No image available to upload!");
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", compressedImage);
    formData.append("upload_preset", "hacktaclicks");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dkoe4zyz3/image/upload",
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

      await handleUploadToBackend(imageUrl);
      setIsModalVisible(false); // Automatically close the modal upon successful upload
    } catch (error) {
      message.error("Failed to upload image to Cloudinary.");
    } finally {
      setUploading(false);
      setFileList([]);
      setPreviewImage(null);
      setCompressedImage(null);
    }
  };

  const handleUploadToBackend = async (imageUrl) => {
    try {
      const taskData = {
        userId: user?.id,
        username: user?.username,
        imageurl: imageUrl,
        shift: user?.shift,
      };

      const response = await axios.post(
        "https://hackta-clicks-backend.vercel.app/api/taskupload",
        taskData
      );
      message.success("Image URL uploaded to the backend successfully!");
    } catch (error) {
      message.error("Failed to upload image URL to the backend.");
    }
  };

  const draggerProps = {
    name: "file",
    multiple: false,
    beforeUpload: async (file) => {
      setFileList([file]);
      await handleCompressImage(file);
      return false;
    },
    onRemove: () => {
      setFileList([]);
      setPreviewImage(null);
      setCompressedImage(null);
      setOriginalSize(0);
      setCompressedSize(0);
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

            {compressing && (
              <Progress
                percent={progress}
                status="active"
                className="upload-progress"
              />
            )}

            {isModalVisible && (
              <Modal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
              >
                <h3>Image Details</h3>
                <p>Original Size: {originalSize} KB</p>
                <p>Compressed Size: {compressedSize} KB</p>
                <Image
                  src={previewImage}
                  alt="Compressed Preview"
                  style={{ maxHeight: "400px" }}
                />
                <Button
                  type="primary"
                  onClick={handleUploadToCloudinary}
                  className="upload-button"
                  loading={uploading}
                  block
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button>
              </Modal>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UploadImages;
