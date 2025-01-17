// TaskUpload Routes
import express from "express";
import TaskUpload from "../models/TaskUpload.js"; // Assuming the model is in ../models/TaskUpload.js

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
  const { username, imageurl } = req.body;
  try {
    const newTask = new TaskUpload({ username, imageurl });
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
