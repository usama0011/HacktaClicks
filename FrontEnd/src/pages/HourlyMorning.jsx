// ShiftHourlyReport.js
import React, { useState, useEffect } from "react";
import { Table, Spin, Typography, message, Pagination } from "antd";
import axiosInstance from "../components/BaseURL";
import AnimatedCount from "../components/AnimatedCount"; // adjust the path as needed

const { Title } = Typography;

const ShiftHourlyReport = ({ shift }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(20);

  // Map shift to API endpoint and expected hour labels.
  const shiftEndpoints = {
    morning: "/reports/hourly/morning",
    evening: "/reports/hourly/evening",
    night: "/reports/hourly/night",
  };

  // Define the order and labels for the hours for each shift.
  const shiftHours = {
    morning: [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "01:00 pm",
      "02:00 pm",
      "03:00 pm",
    ],
    evening: [
      "04:00 pm",
      "05:00 pm",
      "06:00 pm",
      "07:00 pm",
      "08:00 pm",
      "09:00 pm",
      "10:00 pm",
      "11:00 pm",
    ],
    night: [
      "12:00 am",
      "01:00 am",
      "02:00 am",
      "03:00 am",
      "04:00 am",
      "05:00 am",
      "06:00 am",
      "07:00 am",
    ],
  };

  // Fetch new data and update only rows that changed
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(shiftEndpoints[shift], {
        params: { page, limit },
      });
      const newData = response.data.data;

      // Update state using a diff to preserve references for unchanged rows.
      setData((prevData) => {
        // Create a mapping from username to previous row
        const prevMap = new Map();
        prevData.forEach((row) => {
          prevMap.set(row.username, row);
        });
        return newData.map((newRow) => {
          const prevRow = prevMap.get(newRow.username);
          if (prevRow) {
            // Compare the counts objects (shallow check)
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
      message.error("Failed to fetch shift hourly data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000); // live update every second
    return () => clearInterval(interval);
  }, [page, limit, shift]);

  // Build table columns:
  // First column for username then one per hour.
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    ...shiftHours[shift].map((hourLabel) => ({
      title: hourLabel,
      dataIndex: "counts",
      key: hourLabel,
      render: (counts) => (
        // Only the AnimatedCount cell will update if its value changes.
        <AnimatedCount value={counts[hourLabel] || 0} />
      ),
    })),
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>
        {shift.charAt(0).toUpperCase() + shift.slice(1)} Shift Hourly Report
      </Title>
      {loading ? (
        <Spin tip="Loading hourly data..." />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="username" // use username as a stable key
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

export default ShiftHourlyReport;
