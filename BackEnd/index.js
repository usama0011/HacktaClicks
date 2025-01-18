import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import TaskUpload from "./routes/TaskUploadRoute.js";

dotenv.config();
connectDB();

const app = express();

// Define the CORS options
const corsOptions = {
  origin: ["https://hackta-clicks.vercel.app", "http://localhost:5174"], // Replace with your frontend URL
  credentials: true, // Allow cookies and other credentials to be sent
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
};

app.use(cors(corsOptions));
// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/taskupload", TaskUpload);
app.get("/", (req, res, next) => {
  res.status(200).json("Server is Running on Perfect Welcome Hackta Connect");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
