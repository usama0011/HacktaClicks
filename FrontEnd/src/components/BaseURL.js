// src/axiosConfig.js
import axios from "axios";
//http://localhost:5000/api
//https://hackta-clicks-backend.vercel.app/
const baseURL = "https://hackta-clicks-backend.vercel.app"; // Replace with your API base URL

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;