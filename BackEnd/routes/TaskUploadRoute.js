// TaskUpload Routes
import express from "express";
import TaskUpload from "../models/TaskUpload.js"; // Assuming the model is in ../models/TaskUpload.js
import mongoose from "mongoose";

const router = express.Router();

// Get all task uploads
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

  try {
    // Validate userId format
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const folders = await TaskUpload.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json(
      folders.map((folder) => ({
        date: folder._id, // Date from aggregation
        userId: userId, // Include userId from request
      }))
    );
  } catch (error) {
    res.status(500).json({
      message: "Error fetching folders",
      error: error.message,
    });
  }
});

// Get images in a folder by date and user
router.get("/user/:userId/folder/:date", async (req, res) => {
  const { userId, date } = req.params;

  try {
    // Validate the date
    const folderDate = new Date(date);
    if (isNaN(folderDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Calculate start and end of the day for the date
    const startOfDay = new Date(folderDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(folderDate.setHours(23, 59, 59, 999));

    // Fetch images
    const images = await TaskUpload.find({
      userId: userId, // Use 'new' with ObjectId
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching images for folder",
      error: error.message,
    });
  }
});

// Get all users with their userId and username
router.get("/users", async (req, res) => {
  try {
    const users = await TaskUpload.aggregate([
      {
        $group: {
          _id: "$userId", // Group by userId
          username: { $first: "$username" }, // Get the first username for each userId
        },
      },
      {
        $project: {
          userId: "$_id", // Rename _id to userId
          username: 1, // Include the username
          _id: 0, // Exclude the original _id field
        },
      },
      { $sort: { username: 1 } }, // Sort alphabetically by username
    ]);

    if (!users.length) {
      return res.status(200).json({ message: "No users found", data: [] });
    }

    res.status(200).json(users);
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

// Create a new task
router.post("/", async (req, res) => {
  const { username, imageurl, shift, userId } = req.body;
  try {
    const newTask = new TaskUpload({ username, imageurl, shift, userId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
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

// Delete a task by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await TaskUpload.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

export default router;
