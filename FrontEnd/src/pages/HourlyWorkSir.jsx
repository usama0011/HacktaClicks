// ShiftDates.jsx
import React, { useState, useEffect } from "react";
import { List, Spin, Typography, message, Pagination, Card } from "antd";
import { Link } from "react-router-dom";
import axiosInstance from "../components/BaseURL";

const { Title } = Typography;

const HourlyWorkSir = ({ shift }) => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);

  const fetchDates = async () => {
    try {
      const response = await axiosInstance.get(
        `/reports/shift/${shift}/dates`,
        {
          params: { page, limit },
        }
      );
      setDates(response.data.data);
      setTotal(response.data.total);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch dates");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDates();
  }, [page, limit, shift]);

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>
        {shift.charAt(0).toUpperCase() + shift.slice(1)} Shift Dates
      </Title>
      {loading ? (
        <Spin tip="Loading dates..." />
      ) : (
        <>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={dates}
            renderItem={(item) => (
              <List.Item>
                <Link to={`/admindashboard/single/${shift}/date/${item.date}`}>
                  <Card title={item.date}>
                    <p>{item.count} uploads</p>
                  </Card>
                </Link>
              </List.Item>
            )}
          />
          <Pagination
            current={page}
            total={total}
            pageSize={limit}
            onChange={(newPage) => setPage(newPage)}
            showSizeChanger
            onShowSizeChange={(current, size) => {
              setLimit(size);
              setPage(1);
            }}
            style={{ marginTop: "16px", textAlign: "right" }}
          />
        </>
      )}
    </div>
  );
};

export default HourlyWorkSir;
