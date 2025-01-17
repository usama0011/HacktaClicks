import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, Form, Checkbox, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/BaseURL"; // Import the configured axios instance
import "../styles/Login.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/login", values);
      message.success(response.data.message);

      // Save user details and token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Navigate to the dashboard or desired page after successful login
      navigate("/");
    } catch (error) {
      message.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <img
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            src="https://img.freepik.com/free-vector/video-game-developer-concept-illustration_114360-5976.jpg?t=st=1737093192~exp=1737096792~hmac=7c7123d3a2af7f4fa2f61a9e8147cd4cf0b53ca538fa1d44e32ab110313ad806&w=826"
            alt="Login Illustration"
            className="login-illustration"
          />
        </div>
        <div className="login-right">
          <div className="login-form-container">
            <h2 className="login-title">Hacka Connect</h2>
            <p className="login-subtitle">Please enter your details</p>
            <Form layout="vertical" onFinish={onFinish} className="login-form">
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your username"
                  className="login-input"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  className="login-input"
                />
              </Form.Item>

              <Form.Item className="login-options">
                <Checkbox className="login-remember">
                  Remember for 30 days
                </Checkbox>
                <a href="#" className="login-forgot">
                  Forgot Password?
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="login-button"
                >
                  Log In
                </Button>
              </Form.Item>

              <Button className="google-login-button" block>
                Log in with Google
              </Button>
            </Form>
            <div className="login-signup-link">
              Don’t have an account? <a href="/signup">Sign Up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
