// TaskUpload Routes
import express from "express";
import TaskUpload from "../models/TaskUpload.js"; // Assuming the model is in ../models/TaskUpload.js
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";

import multerS3 from "multer-s3";
import mongoose from "mongoose";
// AWS S3 Configuration
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
// Multer Storage for S3

const s3 = new S3Client({
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKETNAME,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
  }),
});
router.get("/", async (req, res) => {
  try {
    const tasks = await TaskUpload.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

router.get("/user/:userId/folders", async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 20 } = req.query; // Default to page 1, limit 20

  try {
    // Validate userId format
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const totalFolders = await TaskUpload.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date
        },
      },
    ]).count("total");

    const folders = await TaskUpload.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date
          imageurl: { $first: "$imageurl" }, // Get the first imageurl in each group
        },
      },
      { $sort: { _id: -1 } }, // Sort by date descending
      { $skip: (page - 1) * limit }, // Skip for pagination
      { $limit: parseInt(limit) }, // Limit the number of results
    ]);

    res.status(200).json({
      folders: folders.map((folder) => ({
        date: folder._id, // Date from aggregation
        userId: userId, // Include userId from request
        imageurl: folder.imageurl, // Include imageurl from aggregation
      })),
      total: totalFolders[0]?.total || 0, // Total folders
      currentPage: parseInt(page),
      totalPages: Math.ceil((totalFolders[0]?.total || 0) / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching folders",
      error: error.message,
    });
  }
});

// Get images in a folder by date and user with pagination
router.get("/user/:userId/folder/:date", async (req, res) => {
  const { userId, date } = req.params;
  const { page = 1, limit = 20 } = req.query; // Default to page 1 and limit 20

  try {
    // Validate the date
    const folderDate = new Date(date);
    if (isNaN(folderDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Calculate start and end of the day for the date
    const startOfDay = new Date(folderDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(folderDate.setHours(23, 59, 59, 999));

    // Fetch total count
    const total = await TaskUpload.countDocuments({
      userId: userId,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    // Fetch images with pagination
    const images = await TaskUpload.find({
      userId: userId,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    })
      .sort({ createdAt: -1 }) // Order by newest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      total,
      images,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching images for folder",
      error: error.message,
    });
  }
});

// Get all users with their userId and username
// Get all users with their userId, username, and shift
router.get("/users", async (req, res) => {
  const { page = 1, limit = 20, username, shift } = req.query; // Default to page 1, limit 20
  const filters = {};

  // Apply filters based on query parameters
  if (username) {
    filters.username = { $regex: username, $options: "i" }; // Case-insensitive search
  }
  if (shift) {
    filters.shift = shift; // Match exact shift
  }

  try {
    // Total count of unique users matching the filters
    const total = await TaskUpload.aggregate([
      { $match: filters }, // Apply filters here
      {
        $group: {
          _id: "$userId",
        },
      },
    ]).count("totalUsers");

    // Fetch paginated data with filters
    const users = await TaskUpload.aggregate([
      { $match: filters }, // Apply filters here
      {
        $group: {
          _id: "$userId", // Group by userId
          username: { $first: "$username" }, // Get the first username for each userId
          shift: { $first: "$shift" }, // Get the first shift for each userId
        },
      },
      {
        $project: {
          userId: "$_id", // Rename _id to userId
          username: 1, // Include the username
          shift: 1, // Include the shift
          _id: 0, // Exclude the original _id field
        },
      },
      { $sort: { username: 1 } }, // Sort alphabetically by username
      { $skip: (page - 1) * limit }, // Skip documents for pagination
      { $limit: parseInt(limit) }, // Limit the number of documents
    ]);

    if (!users.length) {
      return res
        .status(200)
        .json({ message: "No users found", data: [], total: 0 });
    }

    res.status(200).json({
      data: users,
      total: total[0]?.totalUsers || 0, // Total unique users
      currentPage: parseInt(page),
      totalPages: Math.ceil((total[0]?.totalUsers || 0) / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
});

// Get a task by ID
router.get("/:id", async (req, res) => {
  try {
    const task = await TaskUpload.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const { username, shift, userId } = req.body;

  // ✅ Ensure file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const newTask = new TaskUpload({
      username,
      imageurl: req.file.location, // ✅ Now this will work
      shift,
      userId,
    });

    await newTask.save();

    res.status(201).json({
      message: "Image uploaded successfully",
      imageUrl: req.file.location, // ✅ Now correctly returns S3 URL
      task: newTask,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image", error });
  }
});

// Update a task by ID
router.put("/:id", async (req, res) => {
  const { username, imageurl } = req.body;
  try {
    const updatedTask = await TaskUpload.findByIdAndUpdate(
      req.params.id,
      { username, imageurl },
      { new: true, runValidators: true }
    );
    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

router.delete("/user/:userId/folders", async (req, res) => {
  const { userId } = req.params;
  const { dates } = req.body; // Array of selected dates to delete

  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find all matching records for the user and selected dates
    const recordsToDelete = await TaskUpload.find({
      userId: new mongoose.Types.ObjectId(userId),
      createdAt: {
        $gte: new Date(dates[0]),
        $lt: new Date(dates[dates.length - 1] + "T23:59:59.999Z"),
      },
    });

    if (recordsToDelete.length === 0) {
      return res.status(404).json({ message: "No records found to delete" });
    }

    // Remove images from S3
    for (const record of recordsToDelete) {
      const imageKey = record.imageurl.split("uploads/")[1];
      await s3
        .deleteObject({
          bucket: process.env.AWS_BUCKETNAME,
          Key: `uploads/${imageKey}`,
        })
        .promise();
    }

    // Remove records from database
    await TaskUpload.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
      createdAt: {
        $gte: new Date(dates[0]),
        $lt: new Date(dates[dates.length - 1] + "T23:59:59.999Z"),
      },
    });

    res
      .status(200)
      .json({ message: "Folders and images deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting folders", error: error.message });
  }
});

export default router;
