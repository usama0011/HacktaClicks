import mongoose from "mongoose";

const taskUploadSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    imageurl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const TaskUpload = mongoose.model("TaskUpload", taskUploadSchema);

export default TaskUpload;
