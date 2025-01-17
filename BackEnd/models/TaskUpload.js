import mongoose from "mongoose";

const taskUploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }, // Reference to User

    username: { type: String, required: true },
    imageurl: { type: String, required: true },
    shift: {
      type: String,
      required: true,
      enum: ["morning", "evening", "night"], // Valid shift options
    },
  },
  {
    timestamps: true,
  }
);

const TaskUpload = mongoose.model("TaskUpload", taskUploadSchema);

export default TaskUpload;
