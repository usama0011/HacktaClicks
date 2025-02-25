// HourlyWorkDetail.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Spin,
  Typography,
  message,
  Pagination,
  Input,
  Button,
} from "antd";
import axiosInstance from "../components/BaseURL";
import AnimatedCount from "../components/AnimatedCount";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const HourlyWorkDetail = () => {
  const { shift, date } = useParams(); // expects route like "/:shift/date/:date"
  // Add these state variables along with your other states:
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(20);

  // Define interval labels for each shift.
  const shiftHours = {
    morning: [
      "08:00 AM - 09:00 AM",
      "09:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "12:00 PM - 01:00 PM",
      "01:00 PM - 02:00 PM",
      "02:00 PM - 03:00 PM",
      "03:00 PM - 04:00 PM",
    ],
    evening: [
      "04:00 PM - 05:00 PM",
      "05:00 PM - 06:00 PM",
      "06:00 PM - 07:00 PM",
      "07:00 PM - 08:00 PM",
      "08:00 PM - 09:00 PM",
      "09:00 PM - 10:00 PM",
      "10:00 PM - 11:00 PM",
      "11:00 PM - 12:00 AM",
    ],
    night: [
      "12:00 AM - 01:00 AM",
      "01:00 AM - 02:00 AM",
      "02:00 AM - 03:00 AM",
      "03:00 AM - 04:00 AM",
      "04:00 AM - 05:00 AM",
      "05:00 AM - 06:00 AM",
      "06:00 AM - 07:00 AM",
      "07:00 AM - 08:00 AM",
    ],
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `/reports/shift/${shift}/date/${date}`,
        { params: { page, limit, username: usernameFilter } } // added username here
      );
      const newData = response.data.data;
      // Use diffing to preserve unchanged rows.
      setData((prevData) => {
        const prevMap = new Map();
        prevData.forEach((row) => {
          prevMap.set(row.username, row);
        });
        return newData.map((newRow) => {
          const prevRow = prevMap.get(newRow.username);
          if (prevRow) {
            const newCounts = newRow.counts || {};
            const prevCounts = prevRow.counts || {};
            const allKeys = new Set([
              ...Object.keys(newCounts),
              ...Object.keys(prevCounts),
            ]);
            let changed = false;
            for (let key of allKeys) {
              if ((newCounts[key] || 0) !== (prevCounts[key] || 0)) {
                changed = true;
                break;
              }
            }
            if (!changed) return prevRow;
          }
          return newRow;
        });
      });
      setTotalItems(response.data.total);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch hourly detail data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, shift, date, usernameFilter]);

  // Build table columns: Username plus one column per hour interval.
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    ...shiftHours[shift].map((intervalLabel) => ({
      title: intervalLabel,
      dataIndex: "counts",
      key: intervalLabel,
      render: (counts) => <AnimatedCount value={counts[intervalLabel] || 0} />,
    })),
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (value) => <AnimatedCount value={value || 0} />,
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>
        {shift.charAt(0).toUpperCase() + shift.slice(1)} Shift Report for {date}
      </Title>
      <div
        style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}
      >
        <Input
          placeholder="Filter by username"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          style={{ width: 300, marginRight: "8px" }}
        />
        <Button
          type="primary"
          onClick={() => {
            setUsernameFilter(usernameInput);
            setPage(1); // reset to first page when filter changes
          }}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>
      {loading ? (
        <Spin tip="Loading hourly data..." />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={data}
            sticky
            scroll={{ y: 670 }} // or any desired height
            rowKey="username"
            pagination={false}
          />
          <Pagination
            current={page}
            total={totalItems}
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

export default HourlyWorkDetail;
