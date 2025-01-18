import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  DeleteOutlined,
  FilterOutlined,
  SearchOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import axiosInstance from "../components/BaseURL";
import "../styles/UpdateUser.css";

const { Option } = Select;

const UpdateUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterRole, setFilterRole] = useState("");
  const [filterShift, setFilterShift] = useState("");
  const [searchUsername, setSearchUsername] = useState("");

  const [form] = Form.useForm();

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users");
      const userData = response.data.reverse().map((user) => ({
        ...user,
        key: user._id, // Map MongoDB _id to Ant Design key
      }));
      setUsers(userData);
      setFilteredUsers(userData);
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
    Modal.confirm({
      title: "Confirm Password",
      content: (
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        try {
          const values = await form.validateFields();
          if (values.password !== "muix@123") {
            throw new Error("Incorrect password.");
          }
          form.setFieldsValue({
            username: user.username,
            role: user.role,
            shift: user.shift,
          });
          setEditingUser(user);
          setIsModalVisible(true);
          message.success("Password verified. You can now edit the user.");
        } catch (error) {
          message.error(error.message || "Password verification failed.");
        }
      },
      onCancel: () => form.resetFields(),
    });
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
      setFilteredUsers((prevUsers) =>
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

  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`, {
        data: { password: "muix@123" },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.key !== userId));
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user.key !== userId)
      );
      message.success("User deleted successfully.");
    } catch (error) {
      message.error("Failed to delete user.");
    }
  };

  const handleFilter = () => {
    const filtered = users.filter(
      (user) =>
        (filterRole ? user.role === filterRole : true) &&
        (filterShift ? user.shift === filterShift : true) &&
        (searchUsername
          ? user.username.toLowerCase().includes(searchUsername.toLowerCase())
          : true)
    );
    setFilteredUsers(filtered);
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <span>
          <UserOutlined /> {text}
        </span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => (
        <span>
          <FilterOutlined /> {text}
        </span>
      ),
    },
    {
      title: "Shift",
      dataIndex: "shift",
      key: "shift",
      render: (text) => (
        <span>
          <ClockCircleOutlined /> {text}
        </span>
      ),
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
        <>
          <Button
            disabled={record.role === "superadmin"}
            type="link"
            onClick={() => handleEdit(record)}
            style={{ marginRight: "8px" }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            disabled={record.role === "superadmin"} // Disable for superadmin
            onClick={() => handleDelete(record.key)}
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="updateuser-container">
      <h2 className="updateuser-title">Manage Users</h2>

      <Row gutter={[16, 16]} className="updateuser-filters">
        <Col xs={24} sm={8} md={6}>
          <Input
            placeholder="Search by username"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Filter by role"
            value={filterRole}
            onChange={(value) => setFilterRole(value)}
            allowClear
          >
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
            <Option value="superadmin">Superadmin</Option>
          </Select>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Filter by shift"
            value={filterShift}
            onChange={(value) => setFilterShift(value)}
            allowClear
          >
            <Option value="morning">Morning</Option>
            <Option value="evening">Evening</Option>
            <Option value="night">Night</Option>
          </Select>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Button type="primary" onClick={handleFilter} block>
            Apply Filters
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        pagination={{ pageSize: 50 }}
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
            </Select>
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
