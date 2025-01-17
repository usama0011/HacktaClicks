import React, { useState } from "react";
import { Upload, Button, Progress, message, Card, Row, Col } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import "../styles/UploadImage.css";

const { Dragger } = Upload;

const UploadImages = () => {
  const [fileList, setFileList] = useState([]); // Track files
  const [uploading, setUploading] = useState(false); // Track upload state
  const [progress, setProgress] = useState(0); // Track progress

  const handleUpload = () => {
    if (fileList.length === 0) {
      message.warning("Please select a file to upload!");
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simulate upload process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          message.success("Image uploaded successfully!");
          setFileList([]);
          return 100;
        }
        return prev + 10; // Increment progress
      });
    }, 300);
  };

  const draggerProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      setFileList([file]);
      return false; // Prevent default upload behavior
    },
    onRemove: () => setFileList([]),
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

            {uploading && (
              <Progress
                percent={progress}
                status={progress < 100 ? "active" : "success"}
                className="upload-progress"
              />
            )}

            <Button
              type="primary"
              onClick={handleUpload}
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
