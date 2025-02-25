// src/axiosConfig.js
import axios from "axios";
//http://localhost:5000/api
//https://hackta-clicks-backend.vercel.app/api
const baseURL = "https://hackta-clicks-backend.vercel.app/api"; // Replace with your API base URL
//hello
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
