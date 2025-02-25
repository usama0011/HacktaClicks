// routes/hourlyReport.js
import express from "express";
import TaskUpload from "../models/TaskUpload.js"; // adjust the path as needed

const router = express.Router();

router.get("/shift/:shift/dates", async (req, res) => {
  const { shift } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const pipeline = [
      { $match: { shift } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 }, // how many uploads on that date
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      { $sort: { date: -1 } }, // newest date first
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: parseInt(limit) }],
        },
      },
    ];

    const results = await TaskUpload.aggregate(pipeline);
    const total = results[0].metadata[0] ? results[0].metadata[0].total : 0;

    return res.status(200).json({
      data: results[0].data,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error listing shift dates:", error);
    return res.status(500).json({ message: "Error listing shift dates" });
  }
});

router.get("/shift/:shift/date/:date", async (req, res) => {
  const { shift, date } = req.params;
  const { page = 1, limit = 20, username } = req.query; // <-- read username here
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Define numeric hour ranges in local time for each shift.
  const shiftHourRanges = {
    morning: [8, 9, 10, 11, 12, 13, 14, 15], // 8am–4pm local
    evening: [16, 17, 18, 19, 20, 21, 22, 23], // 4pm–12am local
    night: [0, 1, 2, 3, 4, 5, 6, 7], // 12am–8am local
  };

  const hours = shiftHourRanges[shift];
  if (!hours) {
    return res.status(400).json({ message: `Invalid shift: ${shift}.` });
  }

  try {
    const pipeline = [
      // 1) Convert createdAt to local date/hour (e.g. Asia/Karachi).
      {
        $addFields: {
          localDateStr: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Karachi",
            },
          },
          localHour: {
            $hour: {
              date: "$createdAt",
              timezone: "Asia/Karachi",
            },
          },
        },
      },
      // 2) Match only docs that fall on the given date & shift hours,
      //    plus optional username filter if provided.
      {
        $match: {
          shift,
          localDateStr: date,
          localHour: { $in: hours },
          ...(username
            ? { username: { $regex: username, $options: "i" } }
            : {}),
        },
      },
      // 3) Group by username, summing each hour’s count.
      {
        $group: {
          _id: "$username",
          latestHour: { $max: "$localHour" },
          ...Object.fromEntries(
            hours.map((h) => [
              `count${h}`,
              { $sum: { $cond: [{ $eq: ["$localHour", h] }, 1, 0] } },
            ])
          ),
        },
      },
      // 4) Project pivoted counts plus a total.
      {
        $project: (() => {
          // Helper to format a 24-hour number into "HH:00 AM/PM"
          const formatHour = (h) => {
            const suffix = h >= 12 ? "PM" : "AM";
            let hour12 = h % 12;
            if (hour12 === 0) hour12 = 12;
            return `${hour12.toString().padStart(2, "0")}:00 ${suffix}`;
          };

          // Build pivot object for each hour
          const pivotCounts = {};
          hours.forEach((h) => {
            const nextHour = (h + 1) % 24;
            const label = `${formatHour(h)} - ${formatHour(nextHour)}`;
            pivotCounts[label] = `$count${h}`;
          });

          // Summation of all hours
          const totalExpression = {
            $add: hours.map((h) => `$count${h}`),
          };

          return {
            _id: 0,
            username: "$_id",
            counts: pivotCounts,
            latestHour: "$latestHour",
            total: totalExpression, // <--- new field
          };
        })(),
      },
      // 5) Sort by the user’s latest hour desc (optional).
      { $sort: { latestHour: -1 } },
      // 6) Facet for pagination
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: parseInt(limit) }],
        },
      },
    ];

    const results = await TaskUpload.aggregate(pipeline);
    const total = results[0].metadata[0] ? results[0].metadata[0].total : 0;

    return res.status(200).json({
      data: results[0].data,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching shift-date details:", error);
    return res
      .status(500)
      .json({ message: "Error fetching shift-date details" });
  }
});

export default router;
