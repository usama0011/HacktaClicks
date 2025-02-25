// routes/hourlyReport.js
import express from "express";
import TaskUpload from "../models/TaskUpload.js"; // adjust the path as needed

const router = express.Router();

// Helper to build a pipeline for a given shift
// shiftRange: { lower, upper } (upper exclusive) and hourLabels: an array of { field, label }
const buildShiftPipeline = (shiftRange, hourLabels, usernameQuery) => {
  const { lower, upper } = shiftRange;
  const groupStage = {
    _id: "$username",
    latestHour: { $max: "$hr" },
  };
  // Build one conditional sum per hour in the shift.
  hourLabels.forEach(({ field, hour }) => {
    groupStage[field] = {
      $sum: { $cond: [{ $eq: ["$hr", hour] }, 1, 0] },
    };
  });

  // Build a project stage that “pivots” the counts into an object using the labels.
  const countsObj = {};
  hourLabels.forEach(({ field, label }) => {
    countsObj[label] = `$${field}`;
  });

  return [
    {
      $addFields: {
        hr: { $hour: "$createdAt" },
      },
    },
    {
      $match: {
        hr: { $gte: lower, $lt: upper },
        ...(usernameQuery
          ? { username: { $regex: usernameQuery, $options: "i" } }
          : {}),
      },
    },
    {
      $group: groupStage,
    },
    {
      $project: {
        _id: 0,
        username: "$_id",
        counts: countsObj,
        latestHour: 1,
      },
    },
    { $sort: { latestHour: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [], // pagination will be added dynamically below
      },
    },
  ];
};

// Middleware to apply pagination ($skip and $limit) on the facet stage
const applyPagination = (pipeline, skip, limit) => {
  // Append the pagination stage into the facet's data array
  pipeline[pipeline.length - 1].$facet.data = [
    { $skip: skip },
    { $limit: limit },
  ];
  return pipeline;
};

// Morning: 8am (8) to 4pm (16)
router.get("/hourly/morning", async (req, res) => {
  const { page = 1, limit = 20, username } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const morningShift = { lower: 8, upper: 16 };
  const morningHours = [
    { field: "count8", hour: 8, label: "08:00" },
    { field: "count9", hour: 9, label: "09:00" },
    { field: "count10", hour: 10, label: "10:00" },
    { field: "count11", hour: 11, label: "11:00" },
    { field: "count12", hour: 12, label: "12:00" },
    { field: "count13", hour: 13, label: "01:00 pm" },
    { field: "count14", hour: 14, label: "02:00 pm" },
    { field: "count15", hour: 15, label: "03:00 pm" },
  ];
  try {
    let pipeline = buildShiftPipeline(morningShift, morningHours, username);
    pipeline = applyPagination(pipeline, skip, parseInt(limit));
    const results = await TaskUpload.aggregate(pipeline);
    const total = results[0].metadata[0] ? results[0].metadata[0].total : 0;
    res.status(200).json({
      data: results[0].data,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching morning hourly report:", error);
    res.status(500).json({ message: "Error fetching morning hourly report" });
  }
});

// Evening: 4pm (16) to 12am (24)
router.get("/hourly/evening", async (req, res) => {
  const { page = 1, limit = 20, username } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const eveningShift = { lower: 16, upper: 24 };
  const eveningHours = [
    { field: "count16", hour: 16, label: "04:00 pm" },
    { field: "count17", hour: 17, label: "05:00 pm" },
    { field: "count18", hour: 18, label: "06:00 pm" },
    { field: "count19", hour: 19, label: "07:00 pm" },
    { field: "count20", hour: 20, label: "08:00 pm" },
    { field: "count21", hour: 21, label: "09:00 pm" },
    { field: "count22", hour: 22, label: "10:00 pm" },
    { field: "count23", hour: 23, label: "11:00 pm" },
  ];
  try {
    let pipeline = buildShiftPipeline(eveningShift, eveningHours, username);
    pipeline = applyPagination(pipeline, skip, parseInt(limit));
    const results = await TaskUpload.aggregate(pipeline);
    const total = results[0].metadata[0] ? results[0].metadata[0].total : 0;
    res.status(200).json({
      data: results[0].data,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching evening hourly report:", error);
    res.status(500).json({ message: "Error fetching evening hourly report" });
  }
});

// Night: 12am (0) to 8am (8)
router.get("/hourly/night", async (req, res) => {
  const { page = 1, limit = 20, username } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const nightShift = { lower: 0, upper: 8 };
  const nightHours = [
    { field: "count0", hour: 0, label: "12:00 am" },
    { field: "count1", hour: 1, label: "01:00 am" },
    { field: "count2", hour: 2, label: "02:00 am" },
    { field: "count3", hour: 3, label: "03:00 am" },
    { field: "count4", hour: 4, label: "04:00 am" },
    { field: "count5", hour: 5, label: "05:00 am" },
    { field: "count6", hour: 6, label: "06:00 am" },
    { field: "count7", hour: 7, label: "07:00 am" },
  ];
  try {
    let pipeline = buildShiftPipeline(nightShift, nightHours, username);
    pipeline = applyPagination(pipeline, skip, parseInt(limit));
    const results = await TaskUpload.aggregate(pipeline);
    const total = results[0].metadata[0] ? results[0].metadata[0].total : 0;
    res.status(200).json({
      data: results[0].data,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching night hourly report:", error);
    res.status(500).json({ message: "Error fetching night hourly report" });
  }
});

export default router;
