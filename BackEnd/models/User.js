import mongoose from "mongoose";

// User Model
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["superadmin", "admin", "user"],
    },
    shift: {
      type: String,
      required: true,
      enum: ["morning", "evening", "night"], // Valid shift options
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", userSchema);

export default User;
