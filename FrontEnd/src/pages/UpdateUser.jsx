import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import axiosInstance from "../components/BaseURL";
import "../styles/UpdateUser.css";

const { Option } = Select;

const UpdateUser = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users");
      setUsers(
        response.data.map((user) => ({
          ...user,
          key: user._id, // Map MongoDB _id to Ant Design key
        }))
      );
    } catch (error) {
      message.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      role: user.role,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleUpdate = async (values) => {
    try {
      const response = await axiosInstance.put(
        `/users/${editingUser.key}`,
        values
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.key === editingUser.key ? { ...user, ...values } : user
        )
      );
      message.success(response.data.message || "User updated successfully!");
      handleCancel();
    } catch (error) {
      message.error("Failed to update user.");
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          style={{ color: "black" }}
          type="link"
          onClick={() => handleEdit(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="updateuser-container">
      <h2 className="updateuser-title">Manage Users</h2>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{ pageSize: 5 }}
        className="updateuser-table"
      />

      {/* Update User Modal */}
      <Modal
        title="Update User"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="updateuser-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          className="updateuser-form"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input the username!" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select a role">
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
              <Option value="superadmin">Superadmin</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateUser;
