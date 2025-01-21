import express from "express";
import User from "../models/User.js"; // Assuming the model is in ../models/User.js
import TaskUpload from "../models/TaskUpload.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const router = express.Router();

// Get all users with pagination and filtering
router.get("/", async (req, res) => {
  const { page = 1, limit = 20, username, shift, role } = req.query; // Default page and limit
  const filter = {};

  // Add filters based on query parameters
  if (username) {
    filter.username = { $regex: username, $options: "i" }; // Case-insensitive regex search
  }
  if (shift) {
    filter.shift = shift; // Match shift exactly
  }
  if (role) {
    filter.role = role; // Match role exactly
  }

  try {
    const totalUsers = await User.countDocuments(filter); // Count users based on filters
    const users = await User.find(filter)
      .skip((page - 1) * limit) // Skip users for pagination
      .limit(parseInt(limit)) // Limit users per page
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    res.status(200).json({
      data: users,
      total: totalUsers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, "usama225390", {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        shift: user.shift,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in", errormessage: error.message });
  }
});
// Get a user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});
// Get user statistics by shift
router.get("/stats/users", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const morningUsers = await User.countDocuments({ shift: "morning" });
    const eveningUsers = await User.countDocuments({ shift: "evening" });
    const nightUsers = await User.countDocuments({ shift: "night" });

    res.status(200).json({
      totalUsers,
      morningUsers,
      eveningUsers,
      nightUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user stats", error });
  }
});

// Get screenshot statistics by shift
router.get("/stats/screenshots", async (req, res) => {
  try {
    const totalScreenshots = await TaskUpload.countDocuments();
    const morningScreenshots = await TaskUpload.countDocuments({
      shift: "morning",
    });
    const eveningScreenshots = await TaskUpload.countDocuments({
      shift: "evening",
    });
    const nightScreenshots = await TaskUpload.countDocuments({
      shift: "night",
    });

    res.status(200).json({
      totalScreenshots,
      morningScreenshots,
      eveningScreenshots,
      nightScreenshots,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching screenshot stats", error });
  }
});

router.post("/signup", async (req, res) => {
  const { username, password, role, shift } = req.body;

  try {
    // Validate the shift field
    if (!["morning", "evening", "night"].includes(shift)) {
      return res.status(400).json({ message: "Invalid shift value" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      shift,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Check for duplicate username error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username already exists" });
    }

    res.status(500).json({ message: "Error creating user", error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, role, shift } = req.body;

  try {
    // Validate the shift field
    if (shift && !["morning", "evening", "night"].includes(shift)) {
      return res.status(400).json({ message: "Invalid shift value" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, role, shift },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    // Check for duplicate username error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username already exists" });
    }

    res.status(500).json({ message: "Failed to update user", error });
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

export default router;
