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
  Pagination,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(20);

  const [form] = Form.useForm();

  const fetchUsers = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        username: searchUsername || undefined,
        shift: filterShift || undefined,
        role: filterRole || undefined,
      };
      const response = await axiosInstance.get("/users", { params });
      const { data, total } = response.data;
      const userData = data.map((user) => ({
        ...user,
        key: user._id, // Map MongoDB _id to Ant Design key
      }));
      setUsers(userData);
      setFilteredUsers(userData);
      setTotalEntries(total);
    } catch (error) {
      message.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage]);

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
    fetchUsers(1, entriesPerPage); // Fetch filtered users starting from the first page
  };

  const handleResetFilters = () => {
    setFilterRole("");
    setFilterShift("");
    setSearchUsername("");
    fetchUsers(1, entriesPerPage); // Fetch all users starting from the first page
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
            style={{ marginRight: "8px", color: "#00bba6" }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            disabled={record.role === "superadmin"}
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
      <h2
        style={{ textAlign: "center", textDecoration: "underline" }}
        className="updateuser-title"
      >
        Manage Users
      </h2>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <UserOutlined
          style={{ color: "#00bba6", fontSize: "24px", marginRight: "8px" }}
        />
        <span
          style={{ fontWeight: "bold", fontSize: "24px", color: "#00bba6" }}
        >
          {totalEntries}
        </span>
        <span style={{ marginLeft: "8px", fontSize: "18px", color: "#555" }}>
          Users Found
        </span>
      </div>

      <Row gutter={[16, 16]} className="updateuser-filters">
        <Col xs={24} sm={8} md={6}>
          <Input
            placeholder="Search by username"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
            onClear={handleResetFilters} // Reset filters on clear
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Filter by role"
            value={filterRole}
            onChange={(value) => setFilterRole(value)}
            allowClear
            onClear={handleResetFilters} // Reset filters on clear
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
            onClear={handleResetFilters} // Reset filters on clear
          >
            <Option value="morning">Morning</Option>
            <Option value="evening">Evening</Option>
            <Option value="night">Night</Option>
          </Select>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Button
            type="primary"
            style={{ backgroundColor: "#00bba6" }}
            onClick={handleFilter}
            block
          >
            Apply Filters
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        pagination={false}
        className="updateuser-table"
      />

      <Pagination
        current={currentPage}
        total={totalEntries}
        pageSize={entriesPerPage}
        onChange={(page) => setCurrentPage(page)}
        showSizeChanger
        pageSizeOptions={["20", "30", "50", "100"]}
        onShowSizeChange={(current, size) => setEntriesPerPage(size)}
        style={{ marginTop: "20px", textAlign: "center" }}
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
