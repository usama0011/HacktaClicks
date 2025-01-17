import React, { useState } from "react";
import { Form, Input, Button, Modal, message, Select } from "antd";
import axiosInstance from "../components/BaseURL"; // Import Axios instance
import "../styles/Signup.css";

const Signup = () => {
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const correctPassword = "12345678";

  const handleFormSubmit = async (values) => {
    setFormValues(values);
    console.log(values);
    setIsPasswordModalVisible(true);
  };

  const handlePasswordSubmit = async () => {
    if (confirmPassword === correctPassword) {
      try {
        // Make API call to register the user
        const response = await axiosInstance.post("/users/signup", formValues);
        message.success(response.data.message);
        setIsPasswordModalVisible(false);

        // Optionally, redirect to login page after successful signup
        console.log("User successfully registered:", response.data);
      } catch (error) {
        message.error(
          error.response?.data?.message || "Error registering user"
        );
      }
    } else {
      message.error("Wrong password. Try again later.");
    }
  };

  const handlePasswordCancel = () => {
    setIsPasswordModalVisible(false);
    setConfirmPassword("");
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-left">
          <h2 className="signup-title">
            Welcome to{" "}
            <span
              style={{
                color: "#3c6327",
              }}
            >
              Hackta Connect
            </span>
          </h2>
          <p className="signup-description">
            Join us and start exploring our amazing features. Fill in the
            details below to create your account.
          </p>
          <img
            src="https://i.ibb.co/R7pwy4D/icon-design-concept-illustration-114360-5382-removebg-preview.png"
            alt="Signup Illustration"
            className="signup-image"
          />
        </div>
        <div className="signup-right">
          <h2 className="signup-form-title">Create an Account</h2>
          <Form
            layout="vertical"
            onFinish={handleFormSubmit}
            className="signup-form"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item
              label="Shift"
              name="shift"
              rules={[{ required: true, message: "Please select a shift!" }]}
            >
              <Select placeholder="Select a shift">
                <Option value="morning">Morning</Option>
                <Option value="evening">Evening</Option>
                <Option value="night">Night</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Please select a role!" }]}
            >
              <Select placeholder="Select your role">
                <Select.Option value="user">User</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Signup
              </Button>
            </Form.Item>
          </Form>

          <div className="signup-login-redirect">
            <p>
              Already have an account?{" "}
              <a href="/login" className="signup-login-link">
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Password Confirmation Modal */}
      <Modal
        title="Confirm Password"
        visible={isPasswordModalVisible}
        onOk={handlePasswordSubmit}
        onCancel={handlePasswordCancel}
        okText="Submit"
        cancelText="Cancel"
        className="signup-modal"
      >
        <p>Please enter your password to confirm:</p>
        <Input.Password
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Enter password"
        />
      </Modal>
    </div>
  );
};

export default Signup;
